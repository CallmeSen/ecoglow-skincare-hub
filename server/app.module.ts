import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { OrdersModule } from './modules/orders/orders.module';
import { BlogModule } from './modules/blog/blog.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { StatsModule } from './modules/stats/stats.module';
import { DatabaseModule } from './modules/database/database.module';
import { FrontendModule } from './modules/frontend/frontend.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),
    DatabaseModule,
    FrontendModule,
    AuthModule,
    ProductsModule,
    UsersModule,
    CartModule,
    WishlistModule,
    OrdersModule,
    BlogModule,
    QuizModule,
    StatsModule,
  ],
})
export class AppModule {}