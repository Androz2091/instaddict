<script>
    export let title;
    export let description;
</script>

<div class="leaderboard">
    <div class="leaderboard-header">
        <h1 class="leaderboard-title">{title}</h1>
        <p class="leaderboard-description">{description}</p>
    </div>
    <div class="leaderboard-content">
        <slot></slot>
    </div>
</div>

<style>
    .leaderboard {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .leaderboard::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #E1306C, #F56040, #FCAF45);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
    }

    .leaderboard:hover::before {
        opacity: 0.05;
    }

    .leaderboard-header {
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .leaderboard-title {
        font-size: 1.8rem;
        font-weight: 700;
        background: linear-gradient(45deg, #E1306C, #F56040);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 0.5rem 0;
        letter-spacing: -0.02em;
    }

    .leaderboard-description {
        color: rgba(255, 255, 255, 0.7);
        font-size: 1rem;
        margin: 0;
        font-weight: 400;
        line-height: 1.5;
    }

    .leaderboard-content {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    @media (max-width: 768px) {
        .leaderboard {
            padding: 1.5rem;
        }

        .leaderboard-title {
            font-size: 1.5rem;
        }

        .leaderboard-description {
            font-size: 0.9rem;
        }

        .leaderboard-header {
            margin-bottom: 1.25rem;
        }
    }

    @media (max-width: 480px) {
        .leaderboard {
            padding: 1.25rem;
        }

        .leaderboard-title {
            font-size: 1.3rem;
        }

        .leaderboard-description {
            font-size: 0.85rem;
        }

        .leaderboard-content {
            gap: 0.5rem;
        }
    }
</style>
