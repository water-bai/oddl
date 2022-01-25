import { program } from 'commander';
import chalk from 'chalk';
import { commands } from './config/commander';
import { VERSION } from './config/constants';

Object.keys(commands).forEach(command => {
  const commandDetail = commands[command];
  program.command(command)
  .description(commandDetail.description)
  .action(() => {
    require(`./${command}`)(...process.argv.slice(3));
  })
})

// 命令使用帮助指南
function help() {
  let keys = Object.keys(commands);
  const helpCommand = process.argv.length > 3 ? process.argv[3] : ''
  if(helpCommand && keys.includes(helpCommand)) {
    keys = [helpCommand];
  } else if(helpCommand) {
    console.log(chalk.red(`无法查询到${helpCommand}命令`));
    return;
  }

  console.log('\r\nUsage:');
  keys.forEach((command) => {
    console.log(chalk.green(command));
    (commands[command].usages || []).forEach(usage => {
          console.log(`  - ${  usage}`);
      });
  });
  console.log('\r');
}

program.usage('<command> [options]');
program.on('-h', help);
program.on('--help', help);
program.version(VERSION, '-V --version');


program.parse(process.argv);