import { Module } from '@nestjs/common';
import { AdminCatalogController } from './admin-catalog.controller';
import { CatalogService } from './catalog.service';
import { StoreCatalogController } from './store-catalog.controller';

@Module({
  controllers: [StoreCatalogController, AdminCatalogController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
