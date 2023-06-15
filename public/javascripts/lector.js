let pdfDoc = null,
            pgNum = 1,
            pgRender = false,
            pgNumPending = null,
            canvasLeft = document.getElementById('canvas-left'),
            canvasRight = document.getElementById('canvas-right'),
            ctxLeft = canvasLeft.getContext('2d'),
            ctxRight = canvasRight.getContext('2d'),
            container = document.getElementById('lector-pdf'),
            prevButton = document.getElementById('prev-btn'),
            nextButton = document.getElementById('next-btn'),
            irBtn = document.getElementById('ir-btn'),
            paginaInput = document.getElementById('pagina-input');

        function gotoPage() {
            let pageNumber = parseInt(paginaInput.value);
            if (pageNumber <= pdfDoc.numPages) {
                pgNum = pageNumber;
                queueRenderPage(pgNum);
                paginaInput.value = '';
            }
        }

        function updateIrBtnStatus() {
            let pagina = parseInt(paginaInput.value);
            if (pgRender || paginaInput.value === '' ||
                pagina < 1 || pagina > pdfDoc.numPages ||
                pagina === pgNum || pagina === pgNum + 1) {
                irBtn.disabled = true;
            } else {
                irBtn.disabled = false;
            }
        }

        function renderPages() {
            pgRender = true;

            pdfDoc.getPage(pgNum).then(function (page) {
                let viewportLeft = page.getViewport({ scale: 1.5, rotation: 0 }),
                    viewportRight = page.getViewport({ scale: 1.5, rotation: 0 });

                // Ajustar tamaño del canvas
                canvasLeft.height = viewportLeft.height;
                canvasLeft.width = viewportLeft.width;
                canvasRight.height = viewportRight.height;
                canvasRight.width = viewportRight.width;

                let renderContextLeft = {
                    canvasContext: ctxLeft,
                    viewport: viewportLeft
                };

                let renderContextRight = {
                    canvasContext: ctxRight,
                    viewport: viewportRight
                };

                page.render(renderContextLeft).promise.then(function () {
                    if (pgNum + 1 <= pdfDoc.numPages) {
                        return pdfDoc.getPage(pgNum + 1);
                    } else {
                        return null;
                    }
                }).then(function (nextPage) {
                    if (nextPage) {
                        nextPage.render(renderContextRight).promise.then(function () {
                            pgRender = false;
                            if (pgNumPending !== null) {
                                renderPages(pgNumPending);
                                pgNumPending = null;
                            }
                        });
                    } else {
                        pgRender = false;
                    }
                });
            });

            if (pgNum === 1) {
                prevButton.disabled = true;
            } else {
                prevButton.disabled = false;
            }

            if (pgNum >= pdfDoc.numPages) {
                nextButton.disabled = true;
            } else {
                nextButton.disabled = false;
            }

            updateIrBtnStatus();
        }

        function queueRenderPage(num) {
            if (pgRender) {
                pgNumPending = num;
            } else {
                renderPages(num);
            }
        }

        function onPrevPage() {
            if (pgNum <= 1) {
                return;
            }
            pgNum -= 2;
            queueRenderPage(pgNum);
        }

        function onNextPage() {
            if (pgNum >= pdfDoc.numPages) {
                return;
            }
            pgNum += 2
            queueRenderPage(pgNum);
        }

        function initLectorPDF(pdfURL) {
            pdfjsLib.getDocument(pdfURL).promise.then(function (pdfDoc_) {
                pdfDoc = pdfDoc_;
                renderPages();
                nextButton.disabled = false;
            });
        }

        // Aqui se especifica el archivo a leer
        initLectorPDF('../bucket/SEGUNDO MILESTONE.pdf');

        prevButton.addEventListener('click', onPrevPage);
        nextButton.addEventListener('click', onNextPage);
        irBtn.addEventListener('click', gotoPage);
        paginaInput.addEventListener('input', updateIrBtnStatus);