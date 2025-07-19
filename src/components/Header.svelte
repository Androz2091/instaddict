<script>
    import { link, navigate } from 'svelte-routing';
</script>

<header class="app-header">
    <div class="app-header-container">
        <div class="header-brand">
            <div class="app-header-icon tag"><a href="/" use:link>📊</a></div>
            <h1 class="brand-title" on:click="{() => navigate('/')}">Instaddict</h1>
        </div>
        <nav class="header-nav">
            <a href="/" use:link class="nav-link">Home</a>
            <a href="/stats" use:link class="nav-link">Analytics</a>
        </nav>
    </div>
</header>

<style>
    .app-header {
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(10, 10, 10, 0.95);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid var(--border-color);
        z-index: 1000;
        transition: var(--transition);
    }
    
    .app-header-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 1rem 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .header-brand {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .brand-title {
        font-size: 1.75rem;
        font-weight: 800;
        cursor: pointer;
        margin: 0;
        background: linear-gradient(135deg, var(--main-color), var(--secondary-color));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        transition: var(--transition);
    }
    
    .brand-title:hover {
        transform: scale(1.05);
    }
    
    .app-header-icon {
        margin: 0;
    }
    
    .app-header-icon a {
        color: white !important;
        text-decoration: none;
        font-size: 1.2rem;
    }
    
    .header-nav {
        display: flex;
        align-items: center;
        gap: 2rem;
    }
    
    .nav-link {
        color: var(--text-secondary) !important;
        text-decoration: none;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: var(--border-radius-sm);
        transition: var(--transition);
        position: relative;
    }
    
    .nav-link:hover {
        color: var(--text-primary) !important;
        background: var(--elevated-color);
        transform: translateY(-1px);
    }
    
    .nav-link::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 50%;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, var(--main-color), var(--secondary-color));
        transition: var(--transition);
        transform: translateX(-50%);
    }
    
    .nav-link:hover::after {
        width: 80%;
    }
    
    @media (max-width: 768px) {
        .app-header-container {
            padding: 1rem;
        }
        
        .brand-title {
            font-size: 1.5rem;
        }
        
        .header-nav {
            gap: 1rem;
        }
        
        .nav-link {
            padding: 0.25rem 0.75rem;
            font-size: 0.9rem;
        }
    }
    
    @media (max-width: 480px) {
        .header-nav {
            display: none;
        }
        
        .app-header-container {
            justify-content: center;
        }
    }
</style>
