<!DOCTYPE html>
<html>
<head>
</head>
<script>
var image = new Image();
image.src = "sky.jpg";
$(image).load(function() {
    ctx.drawImage(image, 0, 0);
 
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pixels = imageData.data;
    var numPixels = imageData.width * imageData.height;
});
</script>
</html>