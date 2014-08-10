

module game {

    export class StartupCommand extends puremvc.MacroCommand{

        public constructor(){
            super();
        }
        public initializeMacroCommand():void{
            console.log("start up ");
            this.addSubCommand(ControllerPrepCommand);
            this.addSubCommand(ModelPrepCommand);
            this.addSubCommand(ViewPrepCommand);
        }
    }
}