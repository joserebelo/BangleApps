var settings = require("Storage").readJSON("termux.json", true) || {commands:[]};

// Two variables to update
var boolean = false;
var number = 50;
// First menu
var mainmenu = {
  "" : {
    "title" : "Termux"
  },
  /*
  "Beep" : function() { E.showMessage("Lots of text will wrap automatically",{
  title:"Warning",
  img:atob("FBQBAfgAf+Af/4P//D+fx/n+f5/v+f//n//5//+f//n////3//5/n+P//D//wf/4B/4AH4A=")
}) },
  "Buzz" : function() { Bangle.buzz(); },
  "Submenu" : function() { E.showMenu(submenu); },
  "A Boolean" : {
    value : boolean,
    format : v => v?"On":"Off",
    onchange : v => { boolean=v; }
  },
  "A Number" : {
    value : number,
    min:0,max:100,step:10,
    onchange : v => { number=v; }
  },
  "Exit" : function() { E.showMenu(); },*/
};

function runCommand(c) {
  let x = g.getWidth()/2;
  let y = g.getHeight()/2;
  g.setColor(g.theme.bg);
  g.fillRect(x-49, y-19, x+49, y+19);
  g.setColor(g.theme.fg);
  g.drawRect(x-50, y-20, x+50, y+20);
  y -= 4;
  x -= 4*6;
  g.setFont("6x8");
  g.setFontAlign(-1,-1);
  g.drawString("Loading...", x, y);
  setTimeout('E.showMenu(mainmenu);', 2000);
  Bluetooth.println("");
  Bluetooth.println(JSON.stringify({
    t: "intent",
    action: "com.termux.RUN_COMMAND",
    package: "com.termux",
    class: "com.termux.app.RunCommandService",
    extra:{
      "com.termux.RUN_COMMAND_PATH": c.path,
      "com.termux.RUN_COMMAND_ARGUMENTS": c.arguments,
      "com.termux.execute.cwd": c.workdir,
      "com.termux.execute.background": c.background,
      "com.termux.execute.command_label": c.label,
      "com.termux.execute.command_description": c.description,
    }
  }));
}

// Submenu
var submenu = {
  "" : {
    "title" : "-- SubMenu --"
  },
  "One" : undefined, // do nothing
  "Two" : undefined, // do nothing
  "< Back" : function() { E.showMenu(mainmenu); },
};
// Actually display the menu
for (let i = 0; i < settings.commands.length; i++) {
  const c = settings.commands[i];
  mainmenu[c.name] = function() {
    runCommand(c);
  };
}

Bangle.loadWidgets();
Bangle.drawWidgets();
E.showMenu(mainmenu);
