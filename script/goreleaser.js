let shell = require('shelljs')
    shell.config.execPath = '/usr/bin/node' || process.argv[0]

function makeGoreleaser(settings, callback=""){

  let cmd = "printf '"
      cmd += "# goreleaser.yml\n"
      cmd += "# Build Customisation\n"
      cmd += "builds:\n"
      cmd += " - binary: " + settings['name'] + "\n";
      cmd += "   goos: \n";

      for(let i = 0, len = settings['build']['goos'].length; i < len; i++){
          cmd += "   - " + settings['build']['goos'][i] + "\n"
      }

      cmd += "   goarch:\n";

      for(let i = 0, len = settings['build']['goarch'].length; i < len; i++){
          cmd += "   - " + settings['build']['goarch'][i] + "\n"
      }
      cmd += "   ldflags: -s -w\n";

      if(settings['archive']['wanted'] !== 'undefined'){
        cmd += "# Archive Customisation\n"
        cmd += "archive:\n"
        cmd += " format: " + settings['archive']['format'] + "\n";
        cmd += " name_template: \"{{ .Binary }}_{{ .Os }}_{{ .Arch }}\"\n"
      }

      cmd += "' >" + settings['path']  + "/.goreleaser.yml"
      console.log(cmd);
      shell.exec(cmd);
}
