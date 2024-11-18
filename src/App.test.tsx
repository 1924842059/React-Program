import React from "react";
(() => {
  setTimeout(() => {
    console.log(0);
  });
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve;
      Promise.resolve().then(() => {
        console.log(2);
      });
      console.log(3);
    });
  }).then(() => {
    console.log(5);
    Promise.resolve().then(() => {
      console.log(8);
    });
    setTimeout(() => {
      console.log(6);
    });
  });
})();
