// import { Injectable, OnModuleInit } from "@nestjs/common";
// import { ethers } from "ethers";

// @Injectable()
// export class SubscribeService implements OnModuleInit {
//   private provider: ethers.JsonRpcProvider;
//   private readonly targetAddress = process.env.TARGET_WALLET.toLowerCase();

//   constructor() {
//     // dRPC 노드 연결
//     this.provider = new ethers.JsonRpcProvider(process.env.HASHKEY_TESTNET_RPC);
//   }

//   async onModuleInit() {
//     console.log(`🚀 Subscribing to Hashkey events...`);
//     this.subscribeToBlockEvents();
//   }

//   private subscribeToBlockEvents() {
//     this.provider.on("block", async (blockNumber) => {
//       console.log(`🔗 New Block: ${blockNumber}`);

//       // 블록 정보 가져오기 (트랜잭션 해시 목록 포함)
//       const block = await this.provider.getBlock(blockNumber);

//       if (!block || !block.transactions) return;

//       // 블록에 포함된 모든 트랜잭션을 조회
//       for (const txHash of block.transactions) {
//         const tx = await this.provider.getTransaction(txHash);

//         if (tx && tx.to && tx.to.toLowerCase() === this.targetAddress) {
//           console.log(`💰 Incoming transaction detected!`);
//           console.log(`🔹 From: ${tx.from}`);
//           console.log(`🔹 Amount: ${ethers.formatEther(tx.value)} ETH`);
//           console.log(`🔹 Tx Hash: ${tx.hash}`);

//           // 🚀 추가 처리 로직 (예: DB 저장, 알림 전송)
//         }
//       }
//     });
//   }
// }
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ethers } from "ethers";

@Injectable()
export class SubscribeService implements OnModuleInit {
  private provider: ethers.WebSocketProvider;
  private readonly targetAddress = process.env.TARGET_WALLET.toLowerCase();

  constructor() {
    // ✅ WebSocket RPC 연결 (Infura, Alchemy 또는 자체 노드 사용)
    // this.provider = new ethers.WebSocketProvider(process.env.WS_RPC_URL);
  }

  async onModuleInit() {
    console.log(`🚀 Subscribing to Ethereum events via WebSocket...`);
    // this.subscribeToBlockEvents();
  }

  private subscribeToBlockEvents() {
    this.provider.on("block", async (blockNumber) => {
      console.log(`🔗 New Block: ${blockNumber}`);

      const block = await this.provider.getBlock(blockNumber);
      if (!block || !block.transactions) return;

      for (const txHash of block.transactions) {
        const tx = await this.provider.getTransaction(txHash);
        if (tx && tx.to && tx.to.toLowerCase() === this.targetAddress) {
          console.log(`💰 Incoming transaction detected!`);
          console.log(`🔹 From: ${tx.from}`);
          console.log(`🔹 Amount: ${ethers.formatEther(tx.value)} ETH`);
          console.log(`🔹 Tx Hash: ${tx.hash}`);

          // 🚀 추가 처리 로직 (예: DB 저장, 알림 전송)
        }
      }
    });
  }
}
