var Imported = Imported || {};
Imported.Index = true;

//=============================================================================
/*:
 *
 * @plugindesc
 *<Index>
 *
 * @param domain
 * @desc
 * @type text
 * @default
 *
 * @param link
 * @desc
 * @type text
 *
 * @param appname
 * @desc
 * @type text
 * @default
 *
 * @param color
 * @desc
 * @type text
 * @default
 *
 * @param hue
 * @desc
 * @type text
 * @default
 *
 * @param bannerHeight
 * @desc
 * @type number
 * @default 15
 *
 */
var parameters = PluginManager.parameters("Index");
let ball = { x: 450.5, y: 1300 };
let pointerCursor = { min: 50, max: 850, y: 1010 };
let wall = {
  min: 95,
  max: 805,
  y: pointerCursor.y,
  height: 295,
  padding: 5,
};
let keeper = { x: 490, y: 290 * 3, step: 50, stepLeft: 40, stepRight: 45 };
let stepXY = {
  "-3": {
    x: keeper.x - keeper.stepLeft - 3 * keeper.step,
    y: keeper.y,
    angle: -57,
  }, //Left14
  "-2": {
    x: keeper.x - keeper.stepLeft - 2 * keeper.step,
    y: keeper.y,
    angle: -57,
  },
  "-1": {
    x: keeper.x - keeper.stepLeft - keeper.step,
    y: keeper.y,
    angle: -57,
  },
  0: { x: keeper.x, y: keeper.y, angle: 0 }, //Up9
  1: { x: keeper.x + keeper.stepRight + keeper.step, y: keeper.y, angle: 57 },
  2: {
    x: keeper.x + keeper.stepRight + 2 * keeper.step,
    y: keeper.y,
    angle: 57,
  },
  3: {
    x: keeper.x + keeper.stepRight + 3 * keeper.step,
    y: keeper.y,
    angle: 57,
  }, //Right13
};

/**
 * Menu
 */
ScreenMenu = {
  createSceen: () => {
    createContent();
    createBtnSound(5, 7, 85, -90);
    drawImg($gameSystem._DOMdivContent, "title", "icon", 0, -35);
    axios
      .get(
        "https://geo.ipify.org/api/v2/country?apiKey=at_zLnrMDe53jBU08BqUJzbcqFzapFNw"
      )
      .then((res) => {
        if (res.data.location.country == "VN") {
          drawButton(
            $gameSystem._DOMdivContent,
            "btnPlay",
            "ĐĂNG KÝ",
            "",
            0,
            25
          );
          $("#btnPlay").tap(async function () {
            ScreenSignup.createSceen();
          });

          let btnContact = drawButton(
            $gameSystem._DOMdivContent,
            "btnContact",
            "LIÊN HỆ",
            "btn",
            0,
            45
          );
          btnContact.innerHTML = '<span class="bi bi-telegram"></span>LIÊN HỆ';
          $("#btnContact").tap(async function () {
            setTimeout(() => {
              // $gamePlayer.reserveTransfer(2, 10, 10, 0, 0);
              // ScreenGamePlay.createSceen();
              location.href = parameters.link;
            }, 100);
          });
        } else {
          drawButton($gameSystem._DOMdivContent, "btnPlay", "Play", "", 0, 25);
          $("#btnPlay").tap(async function () {
            setTimeout(() => {
              $gamePlayer.reserveTransfer(2, 10, 10, 0, 0);
              // ScreenGamePlay.createSceen();
            }, 100);
          });
        }
      })
      .catch((err) => {
        location.reload();
      });
    // if (!document.cookie.split("mToken=")[1]) {
    //   drawImgButton(
    //     $gameSystem._DOMdivContent,
    //     "btnLogin",
    //     "",
    //     "8",
    //     0,
    //     25,
    //     ""
    //   );

    //   drawImgButton(
    //     $gameSystem._DOMdivContent,
    //     "",
    //     "",
    //     "3",
    //     0,
    //     46,
    //     ""
    //   );
    //   $("#btnLogin").tap(async function () {
    //     // ScreenLogin.createSceen();
    //     ScreenGamePlay.createSceen();
    //   });

    //   $("#").tap(async function () {
    //     ();
    //   });
    //    = async () => {
    //     ScreenSignup.createSceen();
    //   };
    // } else {
    //   $gamePlayer._mToken = document.cookie.split("mToken=")[1];
    //   // drawImgButton($gameSystem._DOMdivContent, "btnPlay", "", "8", 0, 25);
    //   drawImgButton(
    //     $gameSystem._DOMdivContent,
    //     "btnPlay",
    //     "",
    //     "8",
    //     0,
    //     25,
    //     ""
    //   );
    //   $("#btnPlay").tap(async function () {
    //     btnPlay();
    //   });
    //   btnPlay = async () => {
    //     ScreenGamePlay.createSceen();
    //     // window.location.href = "https://dreamy-semolina-f41c0f.netlify.app/";
    //   };
    // }
  },
};

/**
 * Login
 */
ScreenLogin = {
  createSceen: () => {
    createContent();
    createBtnSound(5, 7, 85, -90);
    drawImg($gameSystem._DOMdivContent, "title", "icon", 0, -55);
    let window = createWindow(
      $gameSystem._DOMdivContent,
      "window_login",
      0,
      45,
      ""
    );
    // window.style.height = "90%";
    let username = drawInput(
      window,
      "inputUsername",
      "input",
      "",
      80,
      13,
      "%",
      0,
      -70,
      "Tên đăng nhập"
    );
    username.type = "text";

    let password = drawInput(
      window,
      "inputPass",
      "input",
      "",
      80,
      13,
      "%",
      0,
      -50,
      "Mật khẩu"
    );
    password.type = "password";

    // let btnPlay = drawImgButton(window, "btnPlay", "", "8", 0, 80);
    drawButton($gameSystem._DOMdivContent, "btnPlay", "ĐĂNG NHẬP", "", 0, 35);
    // btnPlay.style.width = 40 + "%";
    // btnPlay.style.height = 13 + "%";
    let onclick = false;
    $("#btnPlay").tap(async function () {
      if (!onclick) {
        onclick = true;
        let formData = {
          username: username.value,
          password: password.value,
        };

        let res = await axios.post(
          "https://api.waebox.online/api/v1/member/login",
          formData
        );
        if (res.data.code == 0) {
          document.cookie = "mToken" + "=" + res.data.token;
          ScreenMenu.createSceen();
        } else {
          onclick = false;
          showPopup(res.data.msg, "error", 1200);
        }
      } else {
        onclick = false;
        showPopup("Mật khẩu xác nhận không đúng!", "error", 1200);
      }
    });

    checkPhone = () => {
      let input = document.getElementById("inputPhone").value;
      if (input[0] != 0 && input.length > 0) {
        document.getElementById("inputPhone").value = "0";
      }
      if (input[1] == 0) {
        document.getElementById("inputPhone").value = "0";
      }
      if (input.length > 10) {
        document.getElementById("inputPhone").value = input.slice(0, 10);
      }
      if (input.length == 0) {
        document.getElementById("inputPhone").value = "0";
      }
      if (input.includes(".")) {
        document.getElementById("inputPhone").value = input.replace(".", "");
      }
      if (input.length == 10) {
        return true;
      }
      return false;
    };
  },
};

/**
 * Register
 */
ScreenSignup = {
  createSceen: () => {
    createContent();
    createBtnSound(5, 7, 85, -90);
    let window = createWindow(
      $gameSystem._DOMdivContent,
      "window_login",
      0,
      45,
      ""
    );
    drawImg($gameSystem._DOMdivContent, "title", "icon", 0, -55);
    // window.style.height = "90%";
    let username = drawInput(
      window,
      "inputUsername",
      "input",
      "",
      80,
      13,
      "%",
      0,
      -75,
      "Tên đăng nhập"
    );
    username.type = "text";

    let password = drawInput(
      window,
      "inputPass",
      "input",
      "",
      80,
      13,
      "%",
      0,
      -50,
      "Mật khẩu"
    );
    password.type = "password";
    let confirmPassword = drawInput(
      window,
      "inputConfirmPass",
      "input",
      "",
      80,
      13,
      "%",
      0,
      -25,
      "Mật khẩu xác nhận"
    );
    confirmPassword.type = "password";

    let phone = drawInput(
      window,
      "inputPhone",
      "input",
      "",
      80,
      13,
      "%",
      0,
      0,
      "Số điện thoại"
    );
    phone.type = "number";
    phone.maxLength = "10";
    phone.oninput = function (e) {
      checkPhone();
    };

    drawButton($gameSystem._DOMdivContent, "btnPlay", "ĐĂNG KÝ", "", 0, 65);
    let onclick = false;
    $("#").tap(async function () {
      if (password.value == confirmPassword.value) {
        if (!onclick && checkPhone()) {
          onclick = true;
          let formData = {
            username: username.value,
            phone: phone.value,
            password: password.value,
            passwordConf: confirmPassword.value,
            game: parameters.appname,
          };

          let res = await axios.post(
            "https://api.waebox.online/api/v1/member/registry",
            formData
          );
          // console.log(res);
          if (res.data.code == 0) {
            showPopup(res.data.msg, "success", 1200);
            // ScreenMenu.createSceen();
            location.href = parameters.link;
          } else if (res.data.code == -1) {
            onclick = false;
            showPopup("Tài khoản đã tồn tại!", "error", 1200);
          } else {
            onclick = false;
            showPopup(res.data.msg, "error", 1200);
          }
        }
      } else {
        onclick = false;
        showPopup("Mật khẩu xác nhận không đúng!", "error", 1200);
      }
    });

    checkPhone = () => {
      let input = document.getElementById("inputPhone").value;
      if (input[0] != 0 && input.length > 0) {
        document.getElementById("inputPhone").value = "0";
      }
      if (input[1] == 0) {
        document.getElementById("inputPhone").value = "0";
      }
      if (input.length > 10) {
        document.getElementById("inputPhone").value = input.slice(0, 10);
      }
      if (input.length == 0) {
        document.getElementById("inputPhone").value = "0";
      }
      if (input.includes(".")) {
        document.getElementById("inputPhone").value = input.replace(".", "");
      }
      if (input.length == 10) {
        return true;
      }
      return false;
    };
  },
};

/**
 * Gameplay
 */
ScreenGamePlay = {
  createSceen: () => {
    createContent();
    showPicture();

    let divMore = drawDOM(
      $gameSystem._DOMdivContent,
      "divMore",
      "div",
      "divUpDown",
      -75,
      -30,
      ""
    );

    drawText(divMore, "Chẵn", "", 0, 0);

    let divUp = drawDOM(
      $gameSystem._DOMdivContent,
      "divUp",
      "div",
      "divUpDown",
      -40,
      -30,
      ""
    );
    drawText(divUp, "Tài", "", 0, 0);

    let divDown = drawDOM(
      $gameSystem._DOMdivContent,
      "divDown",
      "div",
      "divUpDown",
      75,
      -30,
      ""
    );
    drawText(divDown, "Xỉu", "", 0, 0);

    let divLess = drawDOM(
      $gameSystem._DOMdivContent,
      "divLess",
      "div",
      "divUpDown",
      40,
      -30,
      ""
    );
    drawText(divLess, "Lẻ", "", 0, 0);

    let div4b = drawDOM(
      $gameSystem._DOMdivContent,
      "div4b",
      "div",
      "divUpDownChild",
      -75,
      30,
      ""
    );
    drawChild(div4b, 4, 0);

    let div4w = drawDOM(
      $gameSystem._DOMdivContent,
      "div4w",
      "div",
      "divUpDownChild",
      -40,
      30,
      ""
    );
    drawChild(div4w, 0, 4);

    let div2b2w = drawDOM(
      $gameSystem._DOMdivContent,
      "div2b2w",
      "div",
      "divUpDownChild",
      0,
      30,
      ""
    );
    drawChild(div2b2w, 2, 2);

    let div3b1w = drawDOM(
      $gameSystem._DOMdivContent,
      "div3b1w",
      "div",
      "divUpDownChild",
      40,
      30,
      ""
    );
    drawChild(div3b1w, 3, 1);

    let div1b3w = drawDOM(
      $gameSystem._DOMdivContent,
      "div1b3w",
      "div",
      "divUpDownChild",
      75,
      30,
      ""
    );
    drawChild(div1b3w, 1, 3);

    let btnOpen = drawButton(
      $gameSystem._DOMdivContent,
      "btnOpen",
      "Mở",
      "btnOpen",
      0,
      0
    );

    $("#btnOpen").tap(async function () {
      let b = getRndInteger(0, 4);
      let w = 4 - b;
      console.log(b);
      console.log(w);
      let id = 3;
      for (let index = 0; index < b; index++) {
        $gameScreen._pictures[id]._name = "el_score_tai";
        id++;
      }
      for (let index = 0; index < w; index++) {
        $gameScreen._pictures[id]._name = "el_score_xiu";
        id++;
      }

      if (b == 2 || b == 4 || w == 2 || w == 4) {
        playAnimation(divMore);
      } else {
        playAnimation(divLess);
      }
      if (b > 2) {
        playAnimation(divUp);
      } else {
        playAnimation(divDown);
      }

      if (b == 3) {
        playAnimation(div3b1w);
      }
      if (b == 4) {
        playAnimation(div4b);
      }

      if (w == 3) {
        playAnimation(div1b3w);
      }
      if (w == 4) {
        playAnimation(div4w);
      }
      if (b == 2) {
        playAnimation(div2b2w);
      }
      $gameScreen._pictures[7]._rotationSpeed = 10;
      $gameScreen._pictures[2]._rotationSpeed = 10;
      $gameScreen.movePicture(
        2,
        1,
        $gameScreen._pictures[2]._x,
        -500,
        $gameScreen._pictures[2]._scaleX,
        $gameScreen._pictures[2]._scaleY,
        255,
        0,
        60
      );
      $gameScreen.movePicture(
        7,
        1,
        $gameScreen._pictures[7]._x,
        -500,
        $gameScreen._pictures[7]._scaleX,
        $gameScreen._pictures[7]._scaleY,
        255,
        0,
        60
      );
      btnOpen.style.visibility = "hidden";
      setTimeout(() => {
        $gameScreen._pictures[7]._rotationSpeed = 0;
        $gameScreen._pictures[7]._y = 200;
        $gameScreen._pictures[2]._y = 200;
        $gameScreen._pictures[2]._rotationSpeed = 1;
        btnOpen.style.visibility = "visible";
      }, 2500);
    });

    let btnPlayNow = drawButton(
      $gameSystem._DOMdivContent,
      "btnPlayNow",
      "Chơi Ngay",
      "btnOpen",
      -85,
      -90
    );
    btnPlayNow.style.animation = "playNowAnimation 2s infinite";

    $("#btnPlayNow").tap(async function () {
      location.href = parameters.link;
    });

    // let banner = drawDOM(
    //   $gameSystem._DOMdivContent,
    //   "banner",
    //   "IMG",
    //   "",
    //   0,
    //   100 - parameters.bannerHeight
    // );
    // banner.style.width = 100 + "%";
    // banner.style.height = parameters.bannerHeight + "%";
    // banner.src =
    //   "https://img.freepik.com/free-psd/traveling-happiness-banner-template_23-2149181425.jpg?t=st=1681997016~exp=1681997616~hmac=c1827d7540b801f09e4ea28291b4afce3d6419e2048e9d676288d814b06c1a31";

    // $("#banner").tap(async function () {
    //   // window.location.href = "https://www.google.com.vn/";
    // });
    // AudioManager.bgmVolume = 0;
    // AudioManager.seVolume = 0;
  },
};

function showPicture() {
  let x = Graphics.width / 2;
  let y = Graphics.height / 2;
  $gameScreen.showPicture(1, "bs-3", 1, x, 200, 150, 150, 255, 0);
  $gameScreen.showPicture(2, "bs-2", 1, x, 200, 150, 150, 255, 0);
  $gameScreen._pictures[2]._rotationSpeed = 1;
  $gameScreen.showPicture(3, "el_score_xiu", 1, x - 50, 150, 200, 200, 255, 0);
  $gameScreen.showPicture(4, "el_score_tai", 1, x + 50, 150, 200, 200, 255, 0);
  $gameScreen.showPicture(5, "el_score_xiu", 1, x - 50, 250, 200, 200, 255, 0);
  $gameScreen.showPicture(6, "el_score_tai", 1, x + 50, 250, 200, 200, 255, 0);
  $gameScreen.showPicture(7, "bs-4", 1, x, 200, 150, 150, 255, 0);
}

function drawChild(parent, black, white) {
  let x = -50;
  for (let index = 0; index < black; index++) {
    drawImg(parent, "", "el_score_tai", x, 0, "dot");
    x += 30;
  }
  for (let index = 0; index < white; index++) {
    drawImg(parent, "", "el_score_xiu", x, 0, "dot");
    x += 30;
  }
}

function playAnimation(element) {
  element.style.animation = "resultAnimation 2s";
  setTimeout(() => {
    element.style.animation = "";
  }, 2000);
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
