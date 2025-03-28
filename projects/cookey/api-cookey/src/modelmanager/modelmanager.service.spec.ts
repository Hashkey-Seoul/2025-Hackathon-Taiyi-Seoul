import { Test, TestingModule } from '@nestjs/testing';
import { ModelmanagerService } from './modelmanager.service';

describe('ModelmanagerService', () => {
  let service: ModelmanagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelmanagerService],
    }).compile();

    service = module.get<ModelmanagerService>(ModelmanagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
