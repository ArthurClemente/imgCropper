window.onload = function () {
   'use strict';

   const image = document.getElementById('image');
   const btnGetCrop = document.getElementById('btnGetCrop');
   let cropper = new Cropper(image, {
      viewMode: 0,
      aspectRatio: 3 / 4,
      preview: '.img-preview',
      crop(event) {
         console.log(event.detail.x);
         console.log(event.detail.y);
         console.log(event.detail.width);
         console.log(event.detail.height);
         console.log(event.detail.rotate);
         console.log(event.detail.scaleX);
         console.log(event.detail.scaleY);
      },
   });

   let uploadedImageType = 'image/webp'; // Tipo da imagem que será baixada
   let uploadedImageName = 'cropped.webp'; // Nome do arquivo que será baixado


   // Methods
   actions.querySelector('.docs-buttons').onclick = function (event) {
      var e = event || window.event;
      var target = e.target || e.srcElement;
      var cropped;
      var result;
      var input;
      var data;

      if (!cropper) {
         return;
      }

      // Sobe na hierarquia até encontrar o data-method.
      while (target !== this) {
         if (target.getAttribute('data-method')) {
            break;
         }

         target = target.parentNode;
      }

      if (target === this || target.disabled || target.className.indexOf('disabled') > -1) {
         return;
      }

      // Pega o tipo de dado dependendo do atributo da tag.
      data = {
         method: target.getAttribute('data-method'),
         target: target.getAttribute('data-target'),
         option: { width: 300, height: 400,  maxWidth: 4096, maxHeight: 4096, imageSmoothingEnabled: true, imageSmoothingQuality: 'high' },
         secondOption: target.getAttribute('data-second-option') || undefined
      };

      cropped = cropper.cropped;

      // Caso possua data-method.
      if (data.method) {
         if (typeof data.target !== 'undefined') {
            input = document.querySelector(data.target);

            if (!target.hasAttribute('data-option') && data.target && input) {
               try {
                  data.option = JSON.parse(input.value);
               } catch (e) {
                  console.log(e.message);
               }
            }
         }

         // Método de recortar imagem.
         switch (data.method) {
            case 'getCroppedCanvas':
               try { // Converte as opções de recorte da imagem que estão em data-option(caso tenha).
                  data.option = JSON.parse(data.option);
               } catch (e) {
                  console.log(e.message);
               }

               if (uploadedImageType === 'image/jpeg') {
                  if (!data.option) {
                     data.option = {};
                  }

                  data.option.fillColor = '#fff';
               }

               break;
         }

         // Canvas gerado.
         result = cropper[data.method](data.option, data.secondOption);

         switch (data.method) {
            case 'getCroppedCanvas':
               if (result) {
                  // Bootstrap's Modal
                  $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

                  if (!download.disabled) {
                     download.download = uploadedImageName;
                     download.href = result.toDataURL(uploadedImageType);
                     console.log(download.href);
                  }
               }

               break;
         }
         if (typeof result === 'object' && result !== cropper && input) {
            try {
               input.value = JSON.stringify(result);
            } catch (e) {
               console.log(e.message);
            }
         }

      };
   };

}
