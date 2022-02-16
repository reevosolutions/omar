

const PDFStart = function (nameRoute) {
  let loadingTask = pdfjsLib.getDocument(nameRoute),
    pdfDoc = null,
    canvas = document.querySelector('#cnv'),
    ctx = canvas.getContext('2d'),
    scale = 1.5,
    numPage = 1;

  const GeneratePDF = numPage => {

    pdfDoc.getPage(numPage).then(page => {

      let viewport = page.getViewport({ scale: scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      let renderContext = {
        canvasContext: ctx,
        viewport: viewport
      }

      page.render(renderContext);
    })
    document.querySelector('#npages').innerHTML = numPage;

  }

  const PrevPage = () => {
    if (numPage === 1) {
      return
    }
    numPage--;
    GeneratePDF(numPage);
  }

  const NextPage = () => {
    if (numPage >= pdfDoc.numPages) {
      return
    }
    numPage++;
    GeneratePDF(numPage);
  }

  document.querySelector('#prev').addEventListener('click', PrevPage)
  document.querySelector('#next').addEventListener('click', NextPage)

  loadingTask.promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    document.querySelector('#npages').innerHTML = pdfDoc.numPages;
    GeneratePDF(numPage)
  });
}

const startPdf = (file) => {
  PDFStart(file)
}

jQuery(function () {

  $.ajax({
    url: "./data/files.json",
    method: 'GET',
    dataType: 'json',
    success: function (result) {
      console.log(result);
      result.teachers.documents.forEach(function (file) {
        $('#playlist-items').append($('<li class="item">').append($('<a>').text(file.title).attr('href', file.file).on('click', function (e) {
          e.preventDefault();
          $('#pl-viewer').html(`	
            <button id="prev">Prev</button>
            <button id="next">Next</button>
            <span id="npages">not yet</span>
            <div>
              <canvas id="cnv"></canvas>
            </div>`);
          startPdf(file.file);
        })));
        
      })
    }
  });
});
