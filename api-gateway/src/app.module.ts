import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { IntrospectAndCompose } from '@apollo/gateway';
import { ConfigModule } from '@nestjs/config';
import { RemoteGraphQLDataSource } from '@apollo/gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'users',
              url: 'http://localhost:7071/graphql',
            },
            {
              name: 'posts',
              url: 'http://localhost:7072/graphql',
            },
          ],
        }),
        buildService({ url }) {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }) {
              // Ensure context and req exist before setting headers
              if (context?.req?.headers?.authorization) {
                request.http.headers.set(
                  'Authorization',
                  context.req.headers.authorization,
                );
              }
            },
          });
        },
      },
      server: {
        context: ({ req }) => ({ req }),
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
