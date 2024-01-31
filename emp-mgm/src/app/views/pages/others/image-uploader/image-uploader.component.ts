import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CropperComponent } from 'angular-cropperjs';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }


  @ViewChild('angularCropper') public angularCropper: CropperComponent;

  imageUrl: any = 'assets/images/placeholder.jpg';
  resultImage: any;

  // Plugin configuration
  config = {
    zoomable: true,
    autoCrop: false,
    scalable: true,
    viewMode: 2
  };

  ngOnInit(): void {
  }

  openFileBrowser(event: any) {
    event.preventDefault();
    let element: HTMLElement = document.querySelector("#cropperImageUpload") as HTMLElement;
    element.click()
  }

  filetype = 'jpeg'
  filename = 'image.jpeg'
  handleFileInput(event: any) {
    console.log(event)
    if (event.target.files.length) {
      if (event.target.files[0].size > 2097152) {
        alert('Maximum image size is 2MB')
        return
      }
      let element: HTMLElement = document.querySelector("#cropperImageUpload + .input-group .file-upload-info") as HTMLElement;
      let fileName = event.target.files[0].name;
      element.setAttribute('value', fileName)
      var fileTypes = ['jpg', 'jpeg', 'png'];  //acceptable file types
      var extension = event.target.files[0].name.split('.').pop().toLowerCase(),  //file extension from input file
        isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types
      if (isSuccess) { //yes
        // start file reader
        this.filename = fileName;
        this.filetype = event.target.files[0].type;
        const reader = new FileReader();
        const angularCropper = this.angularCropper;
        reader.onload = (event) => {
          if (event.target.result) {
            angularCropper.imageUrl = event.target.result;
          }
        };
        reader.readAsDataURL(event.target.files[0]);
      } else { //no
        alert('Selected file is not an image. Please select an image file.')
      }
    }
  }

  cropImage() {
    this.resultImage = this.angularCropper.cropper.getCroppedCanvas().toDataURL();
    console.log(this.resultImage)
  }

  zoomIn() {
    this.angularCropper.cropper.zoom(0.1);
  }

  zoomOut() {
    this.angularCropper.cropper.zoom(-0.1);
  }

  rotateccw() {
    this.angularCropper.cropper.rotate(-45);
  }

  rotatecw() {
    this.angularCropper.cropper.rotate(45);
  }

  fliphorizontal() {
    var s = this.angularCropper.cropper.getData()
    if (s.scaleX == 1) {
      this.angularCropper.cropper.scaleX(-1);
    }
    if (s.scaleX == -1) {
      this.angularCropper.cropper.scaleX(1);
    }
  }

  flipvertical() {
    var s = this.angularCropper.cropper.getData()
    if (s.scaleY == 1) {
      this.angularCropper.cropper.scaleY(-1);
    }
    if (s.scaleY == -1) {
      this.angularCropper.cropper.scaleY(1);
    }
  }

  move() {
    this.angularCropper.cropper.setDragMode("move");
  }

  iscrop = false
  crop() {
    this.angularCropper.cropper.setDragMode("crop");
    this.iscrop = true
  }

  reset() {
    this.angularCropper.cropper.reset();
  }

  clear() {
    this.angularCropper.cropper.clear();
    this.iscrop = false
  }

  onSubmit() {
    var data = this.imageratio(this.angularCropper.cropper.getData())
    this.angularCropper.cropper.getCroppedCanvas({
      width: data.width,
      height: data.height,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'medium'
    }).toBlob(blob => {
      const file = new File([blob], this.filename);
      this.activeModal.close(file)
    },this.filetype, 0.70);
    
  }

  imageratio(data) {
    var height = data.height;
    var width = data.width;
    var maxWidth = 800; // Max width for the image
    var maxHeight = 800;    // Max height for the image
    var ratio = 0;  // Used for aspect ratio

    // Check if the current width is larger than the max
    if (width > maxWidth) {
      ratio = maxWidth / width;   // get ratio for scaling image
      height = height * ratio;    // Reset height to match scaled image
      width = width * ratio;    // Reset width to match scaled image
    }

    // Check if current height is larger than max
    if (height > maxHeight) {
      ratio = maxHeight / height; // get ratio for scaling image
      width = width * ratio;    // Reset width to match scaled image
      height = height * ratio;    // Reset height to match scaled image
    }

    return ({ width: width, height: height })
  }

}
