import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import Web3 from "web3";

class EventPoller {
  private web3: Web3;
  private contractAddress: string;
  private abi: any;
  private pollingInterval: number;

  constructor(abi: any, pollingInterval = 3000) {
    // HTTP RPC URL을 통해 Web3 인스턴스 생성
    this.web3 = new Web3(process.env.HASHKEY_TESTNET_RPC_HTTPS);
    this.contractAddress = process.env.TARGET_WALLET;
    this.abi = abi;
    this.pollingInterval = pollingInterval;
  }

  // 이벤트 폴링을 위한 메소드
  async pollEvents() {
    // 최근 블록 번호 가져오기
    const latestBlock = await this.web3.eth.getBlockNumber();
    console.log("Latest Block Number:", latestBlock);

    // 과거 이벤트 조회 (예시로 지난 100개의 블록)
    const fromBlock = latestBlock;
    const toBlock = "latest"; // 최신 블록까지 폴링

    // 이벤트 필터
    const filterOptions = {
      address: process.env.TARGET_WALLET, // 특정 주소로 필터링
      fromBlock,
      toBlock,
      topics: [], // 특정 이벤트의 토픽을 지정할 수 있음 (필요 시)
    };

    try {
      // 이벤트 로그 가져오기
      const logs = await this.web3.eth.getPastLogs(filterOptions);
      if (logs.length > 0) {
        console.log("New Events:", logs);
      } else {
        console.log("No new events found.");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  }

  // 폴링 시작 메소드
  startPolling() {
    // 주기적으로 이벤트 폴링
    setInterval(() => {
      this.pollEvents();
    }, this.pollingInterval); // 기본 3초마다 폴링
  }
}

const abi = [
  // ABI 내용 입력 (이벤트 정의 포함)
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
]; // 예시로 ERC-20 토큰의 Transfer 이벤트 ABI 사용

// EventPoller 인스턴스 생성 후 폴링 시작
// const eventPoller = new EventPoller(abi);
// eventPoller.startPolling();

@Injectable()
export class SubscribeService implements OnModuleInit, OnModuleDestroy {
  private web3: Web3;
  private readonly wsRpcUrl = process.env.HASHKEY_TESTNET_RPC_WSS; // WebSocket RPC URL (예: Infura WebSocket URL)
  private readonly httpRpcUrl = process.env.HASHKEY_TESTNET_RPC_HTTPS;
  private readonly targetAddress = process.env.TARGET_WALLET; // 감지할 주소
  private logger = new Logger(SubscribeService.name);

  constructor() {
    this.web3 = new Web3(new Web3.providers.WebsocketProvider(this.wsRpcUrl));
    // console.log(this.wsRpcUrl);
    // console.log(this.targetAddress);
  }

  // WebSocket 연결 및 블록 이벤트 구독
  async onModuleInit() {
    this.logger.log(
      "🚀 Initializing WebSocket connection and event listeners...",
    );

    // WebSocket 연결 상태 확인
    this.web3.eth.net
      .isListening()
      .then(() => this.logger.log("✅ WebSocket connected"))
      .catch((e) => this.logger.error("❌ WebSocket connection failed", e));

    // 새로운 블록 구독
    // this.subscribeToNewBlocks();

    // 특정 주소로 발생한 트랜잭션 로그 구독
    this.subscribeToAddressTransactions();
  }

  // 새로운 블록 구독
  async subscribeToNewBlocks() {
    try {
      // 블록 헤더 구독
      const subscription = await this.web3.eth.subscribe("newBlockHeaders");

      subscription.on("data", (blockHeader) => {
        console.log("New Block Header:", blockHeader);
      });

      subscription.on("error", (error) => {
        console.error("Error in newBlockHeaders subscription:", error);
      });
    } catch (error) {
      console.error("Error in subscribeToNewBlocks:", error);
    }
  }

  // 특정 블록에서 트랜잭션 처리
  private async handleBlock(blockNumber: number) {
    try {
      const block = await this.web3.eth.getBlock(blockNumber, true); // 트랜잭션 정보도 포함
      if (block && block.transactions) {
        block.transactions.forEach((tx) => {
          this.logger.log(`Transaction Hash: ${tx.hash}`);
          this.logger.log(`From: ${tx.from}`);
          this.logger.log(`To: ${tx.to}`);
          this.logger.log(
            `Amount: ${this.web3.utils.fromWei(tx.value, "ether")} ETH`,
          );
        });
      }
    } catch (error) {
      this.logger.error(`Error fetching block data: ${error}`);
    }
  }

  // 특정 주소로 발생한 트랜잭션 로그 구독
  async subscribeToAddressTransactions() {
    try {
      const logFilter = {
        address: this.targetAddress, // 필터로 특정 주소 지정
        topics: [null], // 모든 토픽 구독 (필요에 따라 수정 가능)
      };

      const subscription = await this.web3.eth.subscribe("logs", logFilter);

      subscription.on("data", (log) => {
        console.log("New Log:", log);
      });

      subscription.on("error", (error) => {
        console.error("Error in logs subscription:", error);
      });
    } catch (error) {
      console.error("Error in subscribeToAddressTransactions:", error);
    }
  }

  // WebSocket 종료 시 리소스 정리
  async onModuleDestroy() {
    this.logger.log("🛑 Closing WebSocket connection...");
    const provider = this.web3.currentProvider;

    if (provider && provider instanceof Web3.providers.WebsocketProvider) {
      // WebSocketProvider인 경우 close 메소드 호출
      provider.disconnect();
      this.logger.log("✅ WebSocket connection closed");
    } else {
      this.logger.error("❌ Provider is not a WebSocketProvider");
    }
  }
}
