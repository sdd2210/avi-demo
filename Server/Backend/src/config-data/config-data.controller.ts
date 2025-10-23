import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConfigDataService } from './config-data.service';
import { GlobalStateService } from 'src/global-state/global-state.service';
import moment from "moment";

@Controller('config-data')
export class ConfigDataController {
  constructor(
    private readonly configDataService: ConfigDataService,
    private globalStateService: GlobalStateService,
  ) {}
  @Post()
  async getListMeetingDoc(@Body() body: any) {
    return await this.configDataService.updateConfigFile(body);
  }

  @Get("/list/:userId")
  async getConfigFile(@Param("userId") userId: string) {
    let data = await this.configDataService.getConfigFile();
    const TIME_OUT = 60 * 1000;
    // const current = new Date()
    // const currentVote = this.globalStateService.get("vote");
    data = {
      ...data,
      participant: data.participant.map((x)=>{
        let userVal;
        const current = new Date();
        if(x.id == Number(userId)){
          this.globalStateService.set(userId, {lastActive: current, isAttend: true});
          userVal = {lastActive: current, isAttend: true};
        }else{
          userVal = this.globalStateService.get(String(x.id));
          if(userVal?.isAttend){
            if(current.getTime() - userVal.lastActive.getTime()  > TIME_OUT){
              this.globalStateService.set(String(x.id), {lastActive: userVal.lastActive, isAttend: false});
              userVal = {lastActive: userVal.lastActive, isAttend: false};
            }
          }
        }
        x.status = userVal?.isAttend ?? false;
        x.lastActive = userVal?.lastActive ?? null;
        return x;
      }),
      vote: data.vote?.map((el) => {
        let newStatus = el.status && '' != el.status ? el.status : 'start';

        if (el.start_time && el.status == 'running') {
          const now = new Date();
          if (now.getTime() > new Date(el.end_time).getTime()) {
            newStatus = 'done';
            el.timeleft = 0;
          } else {
            el.timeleft = moment(el.end_time).diff(now, "millisecond");
          }
        }

        el.status = newStatus;

        return el;
      }),
      // vote: data?.vote?.map((x)=>{
      //   x.status = "start";
      //   x.start_time = null;
      //   x.ans = currentVote?.ans ?? [];
      //   if(currentVote?.id == x?.id){
      //     x.status = currentVote?.status ?? "start";
      //     x.start_time = currentVote?.start_time ?? null;
      //     x.ans = currentVote?.ans ?? [];
      //     const diffsec = moment(currentVote?.start_time).add(currentVote?.timeout).diff(new Date(), "millisecond");
      //     if(diffsec >= 0){
      //       x.timeleft = moment.utc(diffsec).format("mm:ss");
      //     }
      //     const TIME_OUT = x.timeout;
      //     if(current.getTime() - currentVote.start_time.getTime()  > TIME_OUT){
      //       x.status = "done";
      //       x.start_time = null;
      //       x.ans = currentVote?.ans ?? [];
      //       this.globalStateService.delete("vote");
      //       this.globalStateService.set("vote-done"+x.id, {
      //         ans: currentVote?.ans ?? [],
      //       });
      //     }
      //     return x;
      //   }else{
      //     const currentDone = this.globalStateService.get("vote-done"+x.id);
      //     if(currentDone){
      //       x.status = "done";
      //       x.start_time = null;
      //       x.ans = currentVote?.currentDone ?? [];
      //     }
      //   }
      //   return x;
      // }),
    }
    return data;
  }

  @Get("/list-vote")
  async getConfigFileVote() {
    const configData = await this.configDataService.getConfigFile();

    return {
      ...configData,
      vote: configData.vote?.map((el) => {
        let newStatus = el.status && '' != el.status ? el.status : 'start';

        if (el.start_time && el.status == 'running') {
          const now = new Date();
          if (now.getTime() > new Date(el.end_time).getTime()) {
            newStatus = 'done';
          }
        }

        el.status = newStatus;

        return el;
      }),
    }
    // let data = await this.configDataService.getConfigFile();
    // const current = new Date()
    // const currentVote = this.globalStateService.get("vote");
    // data = {
    //   ...data,
    //   vote: data?.vote?.map((x)=>{
    //     x.status = "start";
    //     x.start_time = null;
    //     x.ans = [];
    //     if(currentVote?.id == x?.id){
    //       x.status = currentVote?.status ?? "start";
    //       x.start_time = currentVote?.start_time ?? null;
    //       x.ans = currentVote?.ans ?? [];
    //       const TIME_OUT = x.timeout;
    //       if(current.getTime() - currentVote.start_time.getTime()  > TIME_OUT){
    //         x.status = "done";
    //         x.start_time = null;
    //         x.ans = currentVote?.ans ?? [];
    //         this.globalStateService.delete("vote");
    //         this.globalStateService.set("vote-done"+x.id, {
    //           ans: currentVote?.ans ?? [],
    //         });
    //       }
    //       return x;
    //     }else{
    //       const currentDone = this.globalStateService.get("vote-done"+x.id);
    //       if(currentDone){
    //         x.status = "done";
    //         x.start_time = null;
    //         x.ans = currentVote?.currentDone.ans ?? [];
    //       }
    //     }
    //     return x;
    //   }),
    // }
    // return data;
  }

  @Get("/start-vote/:id")
  async startVote(@Param("id") id) {

    let configData = await this.configDataService.getConfigFile();
    let voteData = null;
    const now = new Date();

    const voteNew = configData?.vote?.map((el) => {
      if (id == el.id) {
        el.status = "running";
        el.start_time = now;
        el.end_time = moment(now).add(el.timeout, "millisecond");
        el.ans = [];

        configData.participant?.map((p) => el.ans.push({
          id: "notVote", name: "Chưa biểu quyết", participant_id: p.id
        }));

        voteData = el;
      }
      return el;
    });

    configData = { ...configData, vote: voteNew };

    if (!voteData) return;

    await this.configDataService.updateConfigFile(configData);

    return voteData;
    // const currentVote = this.globalStateService.get("vote");
    // if(currentVote){
    //   return null;
    // }
    // const currentDone = this.globalStateService.get("vote-done"+id);
    // if(currentDone){
    //   this.globalStateService.delete("vote-done"+id);
    // } 
    // const configData = await this.configDataService.getConfigFile();
    // const ans = configData?.vote?.find((x)=>x.id == id)?.options;
    // const startData = {
    //   id: id,
    //   status: "running",
    //   start_time: new Date(),
    //   end_
    //   ans: [{id: "notVote", name: "Chưa biểu quyết"}].concat(...ans)
    // }

    // this.globalStateService.set("vote", startData);
    // return startData;
  }

  @Post("/reset-vote")
  async resetVote(@Body() body) {
    let configData = await this.configDataService.getConfigFile();
    let voteData = null;
    const voteNew = configData?.vote?.map((el) => {
      if (el.status = "running") {
        el.status = "start";
        delete el.status;
        delete el.start_time;
        delete el.end_time;
        delete el.ans;
        voteData = el;
      }
      return el;
    });
    configData = { ...configData, vote: voteNew };

    if (!voteData) return;

    await this.configDataService.updateConfigFile(configData);
    return true
  }

  @Post("/vote")
  async vote(@Body() body) {
    const {participant_id, optionId} = body;

    let configData = await this.configDataService.getConfigFile();
    const newVote = [] as any[];
    configData?.vote?.map((el: any) => {
      const now = new Date();

      if (el.start_time && el.status == 'running' && now.getTime() <= new Date(el.end_time).getTime()) {
        const ansNew = el.ans.filter((a) => a.id != optionId && a.participant_id != participant_id);
        ansNew.push({
          id: optionId, name: '', participant_id: participant_id
        });

        // console.log(ansNew)
        el.ans = ansNew;
      }

      newVote.push(el);
      return el;
    });

    

    return await this.configDataService.updateConfigFile({ ...configData, vote: newVote });

    // const currentVote = this.globalStateService.get("vote");
    // if(!currentVote){
    //   return null;
    // }
    // let ansVote = currentVote.ans?.find((x: any)=>String(x.id) == String(optionId));

    // console.log(ansVote)
    // if(ansVote){
    //   ansVote.value = (ansVote.value ?? 0) + 1;
    // }

    // this.globalStateService.set("vote", {...currentVote, ans: currentVote.ans?.map((x)=>{
    //   if(x.id == ansVote?.id){
    //     x = ansVote;
    //   }
    //   return x;
    // })});
    // return ansVote;
  }
}
