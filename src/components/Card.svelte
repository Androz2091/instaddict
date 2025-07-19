<script>
    export let name;
    export let title;
</script>

<div class="card {name} fade-in">
    <div class="card-header">
        <h2 class="card-title">{title}</h2>
        <div class="card-accent"></div>
    </div>
    <div class="card-content">
        <slot></slot>
    </div>
</div>

<style>
    .card {
        background: var(--card-color);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: 0;
        box-shadow: var(--shadow-sm);
        transition: var(--transition);
        overflow: hidden;
        position: relative;
        backdrop-filter: blur(10px);
    }
    
    .card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
        border-color: var(--main-color);
    }
    
    .card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--main-color), var(--secondary-color), var(--accent-color));
        opacity: 0;
        transition: var(--transition);
    }
    
    .card:hover::before {
        opacity: 1;
    }
    
    .card-header {
        padding: 2rem 2rem 0 2rem;
        position: relative;
    }
    
    .card-title {
        font-weight: 700;
        color: var(--accent-color);
        margin: 0;
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .card-accent {
        width: 4px;
        height: 20px;
        background: linear-gradient(135deg, var(--main-color), var(--secondary-color));
        border-radius: 2px;
        margin-left: auto;
    }
    
    .card-content {
        padding: 1.5rem 2rem 2rem 2rem;
    }
    @media (min-width: 768px) {
        .card.profile {
            grid-column: 1 / 6;
        }
        .card.first {
            grid-column: 6 / 13;
        }
        .card.second {
            grid-column: 1 / 13;
        }
        .card.hours {
            grid-column: 1 / 7;
        }
        .card.top-users {
            grid-column: 7 / 13;
        }
        .card.months {
            grid-column: 1 / 7;
        }
        .card.followers {
            grid-column: 7 / 13;
        }
        .card.ecology {
            grid-column: 1 / 5;
        }
        .card.security {
            grid-column: 5 / 9;
        }
        .card.story-interactions {
            grid-column: 9 / 13;
        }
        .card.social-engagement {
            grid-column: 1 / 13;
        }
    }
    
    @media (min-width: 1024px) {
        .card.profile {
            grid-column: 1 / 5;
        }
        .card.first {
            grid-column: 5 / 9;
        }
        .card.second {
            grid-column: 9 / 13;
        }
        .card.hours {
            grid-column: 1 / 7;
        }
        .card.top-users {
            grid-column: 7 / 13;
        }
        .card.months {
            grid-column: 1 / 7;
        }
        .card.followers {
            grid-column: 7 / 13;
        }
        .card.ecology {
            grid-column: 1 / 5;
        }
        .card.security {
            grid-column: 5 / 9;
        }
        .card.story-interactions {
            grid-column: 9 / 13;
        }
        .card.social-engagement {
            grid-column: 1 / 13;
        }
    }
    
    @media (max-width: 767px) {
        .card {
            margin-bottom: 1rem;
        }
        
        .card-header {
            padding: 1rem 1rem 0 1rem;
        }
        
        .card-content {
            padding: 0.75rem 1rem 1rem 1rem;
        }
        
        .card-title {
            font-size: 1.1rem;
        }
    }
</style>
