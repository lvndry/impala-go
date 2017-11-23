const {
  dialog
} = require('electron').remote;
const fs = require('fs');

let cmd;
let combinaisons = {
  "android": ["arm"],
  "darwin": ["386", "amd64", "arm", "arm64"],
  "dragonfly": ["amd64"],
  "freebsd": ["386", "amd64", "arm"],
  "linux": ["386", "amd64", "arm", "arm64"],
  "netbsd": ["386", "amd64", "arm"],
  "openbsd": ["386", "amd64", "arm"],
  "solaris": ["amd64"],
  "windows": ["386", "amd64"]
};
let dir;
let elogs;
let git_token;
let logpath;
let logs;
let path;
let projectName;
let message;
let settings = {
  "name": "",
  "path": "",
  "build": {
    'goos': [],
    'goarch': [],
    "arm": []
  },
  "archive": {
    "wanted": false,
    "format": "",
  }
};
let tag_message;
let tag_version;

$('#d2b').on('click', function(e) {
  e.preventDefault();
  path = dialog.showOpenDialog({
    properties: ['openDirectory']
  });
});

function combine(value) {
  $("input[name='goos']").each(function() {
    $(this).prop("disabled", false);
  });

  $("input[name='goarch']").each(function() {
    $(this).prop("disabled", false);
  });

  let checkedOs = [];
  $("input[name='goos']:checked").each(function() {
    checkedOs.push($(this).val());
  });

  for (let i = 0, clen = checkedOs.length; i < clen; i++) {
    $("input[name='goarch']").each(function() {
      let name = $(this).val();
      if (combinaisons[checkedOs[i]].indexOf(name) === -1) {
        $(this).prop("disabled", true);
      }
    });
  }

  let checkedArch = [];
  $("input[name='goarch']:checked").each(function() {
    checkedArch.push($(this).val())
  });

  for (let i = 0, clen = checkedArch.length; i < clen; i++) {
    $("input[name='goos']").each(function() {
      let name = $(this).val();
      if (combinaisons[name].indexOf(checkedArch[i]) === -1) {
        $(this).prop("disabled", true);
      }
    });
  }
}

$("input[name='goos']").click(function(e) {
  combine(e.currentTarget.value);
});

$("input[name='goarch']").click(function(e) {
  combine(e.currentTarget.value);
});

$("input[name='archive']").click(function() {
  if ($(this).is(":checked")) {
    $("input[name='archive']").prop("checked", false);
    $(this).prop("checked", true);
  }
});

$("#bb").click(function() {
  settings = {
    "name": "",
    "path": "",
    "build": {
      "goos": [],
      "goarch": [],
      "arm": []
    },
    "archive": {
      "wanted": false,
      "format": ""
    }
  };

  settings['path'] = path;

  logpath = path + '/logs'
  shell.exec("cd " + path + " && git config credential.helper store");

  if (!$("#gt").val()) {
    console.log(process.env.GITHUB_TOKEN);
  } else {
    git_token = $("#gt").val();
    process.env.GITHUB_TOKEN = git_token;
    shell.exec('export GITHUB_TOKEN=' + git_token);
  }

  settings['name'] = ($("#pn").val()) ? $("#pn").val() : 'impala';
  $("input[name='goos']:checked").each(function() {
    settings['build']['goos'].push($(this).val());
  });

  $("input[name='goarch']:checked").each(function() {
    if (settings['build']['goarch'].indexOf($(this).val()) === -1) {
      settings['build']['goarch'].push($(this).val());
    }
    if ($(this).val() === 'arm') {
      settings['build']['arm'].push($(this).attr("id"));
    }
  });

  settings['archive']['format'] = $("input[name='archive']:checked").val();
  if (settings['archive']['format'] !== 'undefined') {
    settings['archive']['wanted'] = true;
  }

  makeGoreleaser(settings);

  tag_version = $("input[name='version']").val();
  tag_message = $("input[name='tag_message']").val();


  let status = shell.exec('cd ' + path + ' && (git status | grep "clean")')

  cmd = "cd " + path + " && ";
  if (status.length === 0)
    cmd += "git add . && git commit -m 'commit before release' && git push && "

  cmd += "git tag -a " + tag_version + " -m '" + tag_message + "' "
  cmd += "&& goreleaser --rm-dist"

  logs = shell.exec(cmd);
  printLogs(logs);
})

function printLogs(log) {
  errs = '<p class="subtitle">'
  log = log.split('\n');

  for (let i = 0, len = log.length; i < len; i++) {
    log[i] += '</p><pclass="subtitle">'
    errs += log[i];
  }
  errs += '</p>';
  $("#gr_errors").html(errs);
}
//TODO: Warngin when no token, warnong when no file
