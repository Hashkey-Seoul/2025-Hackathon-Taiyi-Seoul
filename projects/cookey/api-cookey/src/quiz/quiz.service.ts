import { Injectable } from "@nestjs/common";
import { ModelType } from "src/enums/type.enum";
import { ModelmanagerService } from "src/modelmanager/modelmanager.service";
import {
  QuizDeckDto,
  QuizDto,
  ResponseQuizDeckListDto,
  ResponseQuizListDto,
} from "./dto/response-quiz.dto";
import { Quiz } from "src/schemas/quiz.schema";
import { QuizDeck } from "src/schemas/quiz-deck.schema";
import { Types } from "mongoose";
import { QuizSubmissionDto, UnlockDeckDto } from "./dto/request-quiz.dto";
import { Answer } from "src/schemas/answer.schema";
import { CoreResponseDto } from "src/common/dto/core.dto";
import { UnlockDeck } from "src/schemas/unlock-deck.schema";

@Injectable()
export class QuizService {
  constructor(private readonly modelManager: ModelmanagerService) {}

  async postQuiz() {
    const quizModel = this.modelManager.getModel(ModelType.QUIZ);
    const quiz = new Quiz();
    try {
      quiz.question =
        "What does the meme phrase “It’s over 9000!” have to do with Web3?";
      quiz.answerList = [
        "A BTC price milestone",
        "The amount of ETH burned",
        "A meme used to hype NFT sales volume",
        "Nothing really – it just gets reused because it’s a meme",
      ];
      quiz.correctAnswer =
        "Nothing really – it just gets reused because it’s a meme";
      quiz.category = "mweb3";

      await quizModel.create(quiz);
    } catch (error) {}
    return "done";
  }
  async postQuizDeck() {
    const quizDeckModel = this.modelManager.getModel(ModelType.QUIZDECK);
    const quizModel = this.modelManager.getModel(ModelType.QUIZ);
    const deck = new QuizDeck();
    try {
      deck.title = "Web3 Quiz";
      deck.quizList = await quizModel.find({ category: "mweb3" });
      console.log(deck);
      await quizDeckModel.create(deck);
    } catch (error) {
      console.log(error);
    }
  }
  async postSubmission(body: QuizSubmissionDto) {
    const quizModel = this.modelManager.getModel(ModelType.QUIZ);
    const answerModel = this.modelManager.getModel(ModelType.ANSWER);
    const userModel = this.modelManager.getModel(ModelType.USER);
    const response = new ResponseQuizListDto();

    try {
      const already = await answerModel.findOne({
        wallet: { $regex: new RegExp(`^${body.walletAddress}$`, "i") },
        quiz: body.quizId,
        quizdeck: body.deckId,
      });
      if (already == null) {
        const answer = new Answer();
        answer.deckTitle = body.deckTitle;
        answer.quiz = new Types.ObjectId(body.quizId);
        answer.quizTitle = body.quizTitle;
        answer.quizdeck = new Types.ObjectId(body.deckId);
        answer.selectedAnswer = body.selectedAnswer;
        answer.timeout = body.timeout;
        answer.selectedPercentage = body.selectedPercentage;
        answer.wallet = body.walletAddress;

        await answerModel.create(answer);

        const quiz = await quizModel.findById(body.quizId);
        if (
          !quiz.selectedAnswer ||
          quiz.selectedAnswer === body.selectedAnswer
        ) {
          await userModel.findOneAndUpdate(
            { wallet: { $regex: new RegExp(`^${body.walletAddress}$`, "i") } },
            { $inc: { credit: 1, point: 1 } },
          );
        } else {
          await userModel.findOneAndUpdate(
            { wallet: { $regex: new RegExp(`^${body.walletAddress}$`, "i") } },
            { $inc: { point: 1 } },
          );
        }
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const myAnswers = await answerModel.find({
        wallet: { $regex: new RegExp(`^${body.walletAddress}$`, "i") },
      });
      const user = await userModel.findOne({
        wallet: { $regex: new RegExp(`^${body.walletAddress}$`, "i") },
      });
      const quizAll = await quizModel.find();
      const answerIDS = myAnswers.map((item) => item.quiz.toString());
      for (const quiz of quizAll) {
        const quizDto = new QuizDto();
        quizDto.id = quiz._id;
        quizDto.question = quiz.question;
        quizDto.answerList = quiz.answerList;
        quizDto.correctAnswer = quiz.correctAnswer;
        if (answerIDS.includes(quiz._id.toString())) {
          // console.log("true");
          quizDto.isDone = true;
        } else {
          // console.log("false");
          quizDto.isDone = false;
        }
        quizDto.credits = user.credit;
        quizDto.points = user.point;
        response.data.push(quizDto);
      }
      response.credits = user.credit;
      response.points = user.point;
    } catch (error) {}
    return response;
  }
  async getQuizDeck() {
    const quizdeckModel = this.modelManager.getModel(ModelType.QUIZDECK);
    const response = new ResponseQuizDeckListDto();
    try {
      const deckAll = await quizdeckModel.find();
      for (const deck of deckAll) {
        const quizdeckDto = new QuizDeckDto();
        quizdeckDto.id = deck._id;
        quizdeckDto.title = deck.title;
        for (const quiz of deck.quizList) {
          const quizDto = new QuizDto();
          quizDto.id = quiz._id;
          quizDto.question = quiz.question;
          quizDto.answerList = quiz.answerList;
          quizDto.correctAnswer = quiz.correctAnswer;
          quizdeckDto.quizList.push(quizDto);
        }
        response.data.push(quizdeckDto);
      }
    } catch (error) {
      console.log(error);
    }
    return response;
  }
  async getQuizDeckWallet(wallet) {
    const quizdeckModel = this.modelManager.getModel(ModelType.QUIZDECK);
    const answers = this.modelManager.getModel(ModelType.ANSWER);
    const unlockModel = this.modelManager.getModel(ModelType.UNLOCKDECK);
    const userModel = this.modelManager.getModel(ModelType.USER);

    const response = new ResponseQuizDeckListDto();
    try {
      const deckAll = await quizdeckModel.find();
      const myAnswers = await answers.find({
        wallet: { $regex: new RegExp(`^${wallet}$`, "i") },
      });
      const user = await userModel.findOne({
        wallet: { $regex: new RegExp(`^${wallet}$`, "i") },
      });

      const answerIDS = myAnswers.map((item) => item.quiz.toString());

      for (const deck of deckAll) {
        const quizdeckDto = new QuizDeckDto();
        quizdeckDto.id = deck._id;
        quizdeckDto.title = deck.title;
        quizdeckDto.credits = user.credit;
        quizdeckDto.points = user.point;

        const unlocked = await unlockModel.findOne({
          wallet: { $regex: new RegExp(`^${wallet}$`, "i") },
          deck: deck._id,
        });
        if (unlocked) {
          quizdeckDto.isUnlock = true;
          for (const quiz of deck.quizList) {
            const quizDto = new QuizDto();
            quizDto.id = quiz._id;
            quizDto.question = quiz.question;
            quizDto.answerList = quiz.answerList;
            quizDto.correctAnswer = quiz.correctAnswer;

            if (answerIDS.includes(quiz._id.toString())) {
              // console.log("true");
              quizDto.isDone = true;
            } else {
              // console.log("false");
              quizDto.isDone = false;
            }

            quizdeckDto.quizList.push(quizDto);
          }
        } else {
          quizdeckDto.isUnlock = false;
          quizdeckDto.cost = deck.quizList.length;
        }
        response.data.push(quizdeckDto);
      }
    } catch (error) {
      console.log(error);
    }
    return response;
  }

  async unlockQuizDeckWallet(body: UnlockDeckDto) {
    const quizdeckModel = this.modelManager.getModel(ModelType.QUIZDECK);
    const answers = this.modelManager.getModel(ModelType.ANSWER);
    const unlockModel = this.modelManager.getModel(ModelType.UNLOCKDECK);
    const userModel = this.modelManager.getModel(ModelType.USER);

    const response = new CoreResponseDto();
    try {
      const user = await userModel.findOne({
        wallet: { $regex: new RegExp(`^${body.walletAddress}$`, "i") },
      });
      const deck = await quizdeckModel.findById(body.deckId);
      const unlock = await unlockModel.findOne({
        wallet: { $regex: new RegExp(`^${body.walletAddress}$`, "i") },
        deck: body.deckId,
      });

      if (unlock == null) {
        if (user.credit < deck.quizList.length) {
          response.code = 1;
          response.message = "Not Enough Credit";
          return response;
        } else {
          const unlock = new UnlockDeck();
          unlock.wallet = user.wallet;
          unlock.deck = deck._id;
          await unlockModel.create(unlock);
          await userModel.findByIdAndUpdate(user._id, {
            $inc: { credit: -deck.quizList.length },
          });
          return response;
        }
      } else {
        // console.log(unlock);
      }
    } catch (error) {
      console.log(error);
    }
    return response;
  }
  async getQuiz() {
    const quizModel = this.modelManager.getModel(ModelType.QUIZ);
    const response = new ResponseQuizListDto();
    try {
      const quizAll = await quizModel.find();
      for (const quiz of quizAll) {
        const quizDto = new QuizDto();
        quizDto.id = quiz._id;
        quizDto.question = quiz.question;
        quizDto.answerList = quiz.answerList;
        quizDto.correctAnswer = quiz.correctAnswer;
        response.data.push(quizDto);
      }
    } catch (error) {}
    return response;
  }

  async getQuizWallet(wallet) {
    const quizModel = this.modelManager.getModel(ModelType.QUIZ);
    const answers = this.modelManager.getModel(ModelType.ANSWER);

    const response = new ResponseQuizListDto();
    try {
      const quizAll = await quizModel.find();
      const myAnswers = await answers.find({
        wallet: { $regex: new RegExp(`^${wallet}$`, "i") },
      });

      const answerIDS = myAnswers.map((item) => item.quiz.toString());
      for (const quiz of quizAll) {
        const quizDto = new QuizDto();
        quizDto.id = quiz._id;
        quizDto.question = quiz.question;
        quizDto.answerList = quiz.answerList;
        quizDto.correctAnswer = quiz.correctAnswer;
        if (answerIDS.includes(quiz._id.toString())) {
          // console.log("true");
          quizDto.isDone = true;
        } else {
          // console.log("false");
          quizDto.isDone = false;
        }
        response.data.push(quizDto);
      }
    } catch (error) {}
    return response;
  }
}
