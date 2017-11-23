let shell = require('shelljs')
    shell.config.execPath = '/usr/bin/node' || process.argv[0]

function makeGoreleaser(settings, callback=""){

  let cmd = "printf '"
      cmd += "# goreleaser.yml\n"
      cmd += "project_name: " + settings['name'] + "\n\n"

      //Build
      cmd += "# Build Customisation\n"
      cmd += "builds:\n"
      cmd += " - binary: " + settings['name'] + "\n"

      cmd += "   goos: \n"
      for(let i = 0, len = settings['build']['goos'].length; i < len; i++){
          cmd += "   - " + settings['build']['goos'][i] + "\n"
      }

      cmd += "   goarch:\n";
      for(let i = 0, len = settings['build']['goarch'].length; i < len; i++){
          cmd += "   - " + settings['build']['goarch'][i] + "\n"
      }

      if(settings['build']['arm'].length > 0){
        cmd += "   goarm:\n"
        for(let i = 0, len = settings['build']['arm'].length; i < len; i++){
          cmd += "   - " + settings['build']['arm'][i] + "\n"
        }
      }

      cmd += "   ldflags: -s -w -X main.build={{ .Version }} -X main.date={{ .Date }}\n";

      //Archive
      if(settings['archive']['wanted'] !== 'undefined'){
        cmd += "# Archive Customisation\n"
        cmd += "archive:\n"
        cmd += " format: " + settings['archive']['format'] + "\n";
        cmd += " name_template: \"{{ .ProjectName }}_{{ .Version }}_{{ .Os }}_{{ .Arch }}{{ if .Arm }}v{{ .Arm }}{{ end }}\"\n"

        cmd += " format_overrides:\n"
        cmd += "   - goos: windows\n"
        cmd += "     format: zip\n"

        cmd += " replacements:\n"
        cmd += "   amd64: 64-bit\n"
        cmd += "   386: 32-bit\n"
        cmd += "   darwin: macOS\n"

        cmd += " files:\n"
        cmd += "   - licence*\n"
        cmd += "   - LICENCE*\n"
        cmd += "   - license*\n"
        cmd += "   - LICENSE*\n"
        cmd += "   - readme*\n"
        cmd += "   - README*\n"
        cmd += "   - changelog*\n"
        cmd += "   - CHANGELOG*\n\n"
      }

      cmd += "# Checksum\n"
      cmd += "checksum:\n"
      cmd += " name_template: \"{{ .ProjectName }}_checksum.txt\""
      cmd += "' > " + settings['path']  + "/.goreleaser.yml"
      
      shell.exec(cmd);
}
