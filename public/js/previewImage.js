function displayImage(input) {
  if (input.files && input.files[0]) {
    var extension = input.files[0].name.split('.').pop().toLowerCase();
    if (extension === "jpg" || extension === "png") {
      var reader = new FileReader();

      reader.onload = function (e) {
        $('#preview')
          .attr('src', e.target.result)
          .width(200)
          .height(200);
      };

      reader.readAsDataURL(input.files[0])
    }
  }
}
