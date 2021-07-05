<script>
    export let name;
    export let title;
</script>

<div class="card {name}">
    <h2>{title}</h2>
    <slot></slot>
</div>

<style>

    h2 {
        font-weight: 600;
        color: #FCAF45;
    }

    .card {
        background-color: #202225;
        border-radius: 10px;
        padding: 20px;
    }
    @media (min-width: 600px) {
        .card.first {
            grid-column: 4 / 8;
        }
        .card.second {
            grid-column: 8 / 12;
        }
        .card.third {
            grid-column: 1 / 4;
            grid-row: 2 / 3;
        }
        .card.fourth {
            grid-column: 4 / 6;
            grid-row: 2 / 3;
        }
        .card.top-users {
            grid-column: 1 / 6;
        }
        .card.top-channels {
            grid-column: 6 / 12;
        }
        .card.hours {
            grid-column: 6 / 12;
            grid-row: 2 / 3;
        }
        .card.profile {
            grid-column: 1 / 4;
        }
        .card.about {
            grid-column: 1 / 6;
        }
    }
</style>
