function showImageForEdit(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
     cropImage(e);
    };
    reader.readAsDataURL(input.files[0]);
  }
}


function cropImage(e) {
    var Uimg = document.getElementById("image_selected");
    Uimg.setAttribute('src', e.target.result);
    Uimg.setAttribute("style","height:200px; width:200px");
    var vanilla = new Croppie(Uimg, {
      viewport: { width: 100, height: 100 },
      boundary: { width: 300, height: 300 },
      showZoomer: true,
      enableOrientation: true
    });
    Oimg = document.getElementsByTagName('img')[0];
    vanilla.bind({
      url: Oimg.src,
      orientation: 4,
      zoom: 0
    });
    Uimg.addEventListener('update', function (ev) {
      console.log('vanilla update', ev);
    });
    document.querySelector('.vanilla-result').addEventListener('click', function (ev) {
      ev.preventDefault();
      vanilla.result({
        type: 'blob',
        size: 'original'
      }).then(function (resp) {
        document.getElementById('imagebase64').file = resp;
        document.getElementById('uploadImageForm').submit();
      });
    });
    document.querySelector('.vanilla-rotate').addEventListener('click', function(ev) {
      vanilla.rotate(parseInt(90));
    });
  }