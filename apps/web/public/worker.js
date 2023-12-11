self.addEventListener("message", (e) => {
    // メッセージを受け取ったときに動かすコード
    console.log("worker received a message", e);
    if(remark){
        remark.create({
          ratio: "16:9",
          navigation: {
            scroll: false,
          },
          highlightStyle: 'monokai',
          source: e.data,
          container: document.getElementById('slide')
        });
      }
  });