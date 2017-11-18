let shell = require('shelljs')
    shell.config.execPath = '/usr/bin/node' || process.argv[0]

function makeGoreleaser(projectName, dirPath, settings, callback=""){

  let cmd = "printf '"
      cmd += "# goreleaser.yml\n"
      cmd += "# Build Customisation\n"
      cmd += "builds:\n"
      cmd += " - binary: " + projectName + "\n";
      cmd += "   goos: \n";

      for(let i = 0, len = settings['build']['goos'].length; i < len; i++){
          cmd += "   - " + settings['build']['goos'][i] + "\n"
      }

      cmd += "   goarch:\n";

      for(let i = 0, len = settings['build']['goarch'].length; i < len; i++){
          cmd += "   - " + settings['build']['goarch'][i] + "\n"
      }

      if(settings['archive']['wanted'] !== 'undefined'){
        cmd += "# Archive Customisation\n"
        cmd += "archive:\n"
        cmd += " format: " + settings['archive']['format'] + "\n";
      }

      cmd += "' >" + dirPath  + "/.goreleaser.yml"
      console.log(cmd);
      shell.exec(cmd);
}
