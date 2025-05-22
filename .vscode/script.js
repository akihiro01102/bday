document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation ---
    const navLinks = document.querySelectorAll('nav ul li a');
    const pages = document.querySelectorAll('.page');

    function setActivePage(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`nav ul li a[href="#${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = event.target.getAttribute('href').substring(1);
            setActivePage(targetId);
        });
    });

    // --- Photo Gallery (Modal - Existing, for gallery-grid type) ---
    // Note: The flipping book gallery will handle its own display,
    // so this modal part might be for a *separate* gallery section if you have one.
    // If you intend for clicking images within the *flipping book* to open a modal,
    // we'll need to adapt this, but the primary request was for flipping.
    const galleryImages = document.querySelectorAll('#photo-gallery .gallery-grid img');
    const modal = document.querySelector('#photo-gallery .modal'); // Ensure this modal exists in your HTML
    const modalImg = document.querySelector('#photo-gallery .modal-content'); // Ensure this modal-content exists
    const closeBtn = document.querySelector('#photo-gallery .modal .close'); // Ensure this close button exists

    // Only add listeners if modal elements are present to avoid errors
    if (modal && modalImg && closeBtn) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                modal.style.display = 'flex';
                modalImg.src = img.src;
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }


    // --- Birthday Wishes ---
    const birthdayWishesSection = document.getElementById('birthday-wishes');
    const roseGif = birthdayWishesSection ? birthdayWishesSection.querySelector('.rose-gif') : null; // Check if section exists

    if (birthdayWishesSection && roseGif) { // Ensure both elements exist
        birthdayWishesSection.addEventListener('click', () => {
            roseGif.classList.add('show');
        });
    }

    // --- Flipping Photo Gallery Logic (NEW / Corrected from previous response) ---
    const photoGallerySection = document.getElementById('photo-gallery');
    if (photoGallerySection) { // Ensure the photo gallery section exists
        const galleryPages = photoGallerySection.querySelectorAll('.page-item');
        const prevButton = photoGallerySection.querySelector('.prev-button');
        const nextButton = photoGallerySection.querySelector('.next-button');
        let currentGalleryPageIndex = 0; // Separate index for the gallery

        // --- Initial setup for the flipping gallery ---
        galleryPages.forEach((page, index) => {
            if (index === 0) {
                page.classList.add('active');
                page.style.display = 'flex'; // Ensure the first page is visible
            } else {
                page.style.display = 'none'; // Hide other pages initially
            }
        });

        // Function to handle page flipping
        const flipGalleryPage = (direction) => {
            const prevIndex = currentGalleryPageIndex;
            let newIndex = currentGalleryPageIndex;

            if (direction === 'next') {
                newIndex = (currentGalleryPageIndex + 1) % galleryPages.length;
            } else if (direction === 'prev') {
                newIndex = (currentGalleryPageIndex - 1 + galleryPages.length) % galleryPages.length;
            }

            // If no change or already animating, do nothing
            if (newIndex === currentGalleryPageIndex) {
                return;
            }

            const currentPage = galleryPages[currentGalleryPageIndex];
            const newPage = galleryPages[newIndex];

            // Ensure the new page is visible (but not yet active) for the animation
            newPage.style.display = 'flex';
            newPage.style.transform = 'rotateY(0deg)'; // Reset transform for next page

            // Apply flip animation to the current page
            if (direction === 'next') {
                currentPage.classList.add('flip-right');
            } else if (direction === 'prev') {
                currentPage.classList.add('flip-left');
            }

            // Update index immediately for quick clicks, but manage visibility after animation
            currentGalleryPageIndex = newIndex;

            // Wait for the animation to complete on the *current* page
            currentPage.addEventListener('transitionend', function transitionEndHandler() {
                // Remove active and flip classes from the old page
                currentPage.classList.remove('active', 'flip-left', 'flip-right');
                currentPage.style.display = 'none'; // Hide the old page
                currentPage.style.transform = 'rotateY(0deg)'; // Reset its transform

                // Set the new page as active and ensure it's visible
                newPage.classList.add('active');
                newPage.style.display = 'flex'; // Ensure it stays visible

                // Remove the event listener to prevent multiple triggers
                currentPage.removeEventListener('transitionend', transitionEndHandler);
            }, { once: true }); // 'once: true' ensures the listener runs only once
        };

        // Event listeners for prev/next buttons
        if (prevButton) {
            prevButton.addEventListener('click', () => flipGalleryPage('prev'));
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => flipGalleryPage('next'));
        }

        // Optional: Clicking on the active image itself to flip
        galleryPages.forEach((page) => {
            page.addEventListener('click', (event) => {
                // Ensure it's the active page that's clicked
                if (page.classList.contains('active')) {
                    const clickX = event.clientX - page.getBoundingClientRect().left;
                    const pageHalf = page.offsetWidth / 2;

                    if (clickX < pageHalf) {
                        // Click on the left half
                        flipGalleryPage('prev');
                    } else {
                        // Click on the right half
                        flipGalleryPage('next');
                    }
                }
            });
        });
    }

    // Set the initial active page for overall navigation
    setActivePage('welcome');
});