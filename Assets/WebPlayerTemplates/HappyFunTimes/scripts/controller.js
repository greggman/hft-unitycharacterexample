/*
 * Copyright 2014, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";

// Start the main app logic.
requirejs([
    'hft/commonui',
    'hft/gameclient',
    'hft/misc/dpad',
    'hft/misc/input',
    'hft/misc/misc',
    'hft/misc/mobilehacks',
    'hft/misc/touch',
  ], function(
    CommonUI,
    GameClient,
    DPad,
    Input,
    Misc,
    MobileHacks,
    Touch) {
  var g_client;
  var g_audioManager;

  var globals = {
    debug: false,
    orientation: "landscape-primary",
  };
  Misc.applyUrlSettings(globals);
  MobileHacks.fixHeightHack();
  MobileHacks.disableContextMenu();
  MobileHacks.adjustCSSBasedOnPhone([
    {
      test: MobileHacks.isIOS8OrNewerAndiPhone4OrIPhone5,
      styles: {
        "#dpadleft": {
          bottom: "6em",
        },
        "#dpadright": {
          bottom: "6em",
        },
      },
    },
  ]);

  function $(id) {
    return document.getElementById(id);
  }

  g_client = new GameClient();

  function handleScore() {
  };

  function handleDeath() {
  };

  g_client.addEventListener('score', handleScore);
  g_client.addEventListener('die', handleDeath);

  var color = Misc.randCSSColor();
  g_client.sendCmd('setColor', { color: color });
  document.body.style.backgroundColor = color;

  var dpadSize = 160;
  var dpads = [
    new DPad({size: dpadSize, element: $("dpadleft")}),
    new DPad({size: dpadSize, element: $("dpadright")}),
  ];

  function sendPad(e) {
    if (globals.debug) {
      console.log("pad: " + e.pad + " dir: " + e.info.symbol + " (" + e.info.direction + ")");
    }
    // Draw the dpad
    dpads[e.pad].draw(e.info);
    g_client.sendCmd('pad', {pad: e.pad, dir: e.info.direction});
  };

  CommonUI.setupStandardControllerUI(g_client, globals);

  Input.setupKeyboardDPadKeys(sendPad);
  var container = $("dpadinput");
  Touch.setupVirtualDPads({

    // the container that receives all input
    inputElement: container,

    // the function to call when we get inupt
    callback: sendPad,

    // whether or not the center stays fixed. If false
    // the system will assume the place the player touchs
    // is the center, they then have to move their finger
    // from that spot to move. That doesn't seem to work
    // well or maybe it just needs some iteration
    fixedCenter: true,

    // an array of pads and were their center is.
    pads: [
      {
        referenceElement: $("dpadleft"),
      },
      {
        referenceElement: $("dpadright"),
      },
    ],
  });

});


