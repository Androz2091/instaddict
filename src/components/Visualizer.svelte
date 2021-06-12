<script>
    import { data } from '../app/store';
</script>

<template>
    <div class="app-stats">
        <div class="app-stats-box">
            Messages: {$data.totalMessageCount}

            Classements chats:
            {$data.chats.sort((a, b) => b.messages.length - a.messages.length)[0].name}
        </div>
    </div>
</template>

<style>
    .app-stats {
        padding: 5rem 3rem;
        display: grid;
    }
    .app-stats-box {
        padding: 3rem;
        background-color: var(--box-background-color);
        border-radius: 0.5rem;
        box-shadow: rgb(0 0 0 / 25%) 0px 4px 8px;
    }
    @media (min-width: 1080px) {
        .app-stats {
            grid-template-columns: repeat(12, 1fr);
        }
    }
</style>
