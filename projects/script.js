$(document).ready(function () {
    // Toggle navbar
    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    // Scroll behavior
    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');
        $('#scroll-top').toggleClass('active', $(this).scrollTop() > 60);
    });

    // Load projects
    loadProjects();
});

// Change title and favicon on tab switch
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === "visible") {
        document.title = "Projects | Portfolio Ankit Srivastav";
        $('#favicon').attr('href', '/assets/images/favicon.png');
    } else {
        document.title = "Come Back To Portfolio";
        $('#favicon').attr('href', '/assets/images/favhand.png');
    }
});

// Fetch and render projects
async function loadProjects() {
    try {
        const container = document.getElementById("projects");
        if (!container) {
            showError("Project container not found");
            return;
        }

        container.innerHTML = '<div class="loading">Loading projects...</div>';

        const res = await fetch('projects.json');
        if (!res.ok) {
            throw new Error(`Failed to fetch projects: ${res.status}`);
        }

        const projects = await res.json();
        displayProjects(projects);
    } catch (err) {
        console.error("Error loading projects:", err);
        showError("Failed to load projects. Please try again later.");
    }
}

// Show error message
function showError(message) {
    const container = document.getElementById("projects");
    if (container) {
        container.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Render project cards
function displayProjects(projects) {
    const container = document.getElementById("projects");
    if (!container || !projects || !projects.length) {
        showError("No projects found");
        return;
    }

    let html = '';
    projects.forEach(project => {
        if (!project.image) {
            project.image = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=500&q=60";
        }

        html += `
        <div class="grid-item ${project.category || ''}">
            <div class="box tilt">
                <div class="image-container" style="
                    width: 100%;
                    height: 200px;
                    background-image: url('${project.image}');
                    background-size: cover;
                    background-position: center;
                    border-radius: 8px;
                "></div>
                <div class="content">
                    <div class="tag"><h3>${project.name || 'Untitled Project'}</h3></div>
                    <div class="desc">
                        <p>${project.desc || 'No description available'}</p>
                        <div class="btns">
                            ${project.links?.view ? `
                            <a href="${project.links.view}" class="btn" target="_blank" rel="noopener noreferrer">
                                <i class="fas fa-eye"></i> View
                            </a>` : ''}
                            ${project.links?.code ? `
                            <a href="${project.links.code}" class="btn" target="_blank" rel="noopener noreferrer">
                                Code <i class="fas fa-code"></i>
                            </a>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;

    // Initialize Isotope if jQuery is available
    if (typeof $ !== 'undefined' && $.fn.isotope) {
        const $grid = $('.box-container').isotope({
            itemSelector: '.grid-item',
            layoutMode: 'fitRows'
        });

        // Filter buttons
        $('.button-group').on('click', 'button', function () {
            $('.button-group .is-checked').removeClass('is-checked');
            $(this).addClass('is-checked');
            const filter = $(this).attr('data-filter') || '*';
            $grid.isotope({ filter });
        });
    }

    // Initialize tilt animation if available
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.tilt'), {
            max: 20,
            speed: 400,
            glare: true,
            "max-glare": 0.2
        });
    }
}

// Tawk.to chat initialization
if (typeof Tawk_API === 'undefined') {
    (function () {
        var s1 = document.createElement("script");
        s1.async = true;
        s1.src = 'https://embed.tawk.to/60df10bf7f4b000ac03ab6a8/1f9jlirg6';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        document.getElementsByTagName("script")[0].parentNode.insertBefore(s1, null);
    })();
}