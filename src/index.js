import { program } from 'commander';
import { commands } from './config/commander';


Object.keys(commands).forEach(command => {
  const commandDetail = commands[command]
  program.command(command)
  .description(commandDetail.description)
  .action(() => {
    require(`./${command}`)(...process.argv.slice(3))
  })
})

program.parse(process.argv);