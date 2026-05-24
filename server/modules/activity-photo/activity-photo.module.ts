import { Module } from '@nestjs/common';
import { ActivityPhotoService } from './activity-photo.service';
import { ActivityPhotoController } from './activity-photo.controller';

@Module({
  controllers: [ActivityPhotoController],
  providers: [ActivityPhotoService],
})
export class ActivityPhotoModule {}
