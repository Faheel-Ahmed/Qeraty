import {
  Controller
} from '@nestjs/common';
import { GroupsService } from './groups.service';

@Controller('api/v1')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  
}