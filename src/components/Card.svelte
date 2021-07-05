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
        .card.ecology {
            grid-column: 1 / 6;
            grid-row: 4 / 5;
        }
        .card.security {
            grid-column: 1 / 3;
        }
        .card.top-users {
            grid-column: 1 / 6;
            grid-row: 2 / 4;
        }
        .card.top-channels {
            grid-column: 6 / 12;
        }
        .card.hours {
            grid-column: 6 / 12;
            grid-row: 2 / 3;
        }
        .card.months {
            grid-column: 6 / 12;
        }
        .card.profile {
            grid-column: 1 / 4;
        }
        .card.about {
            grid-column: 1 / 6;
        }
        .card.followers {
            grid-column: 6 / 12;
        }
    }
</style>
