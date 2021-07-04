<script>
    import { blur } from 'svelte/transition';
    import { data } from '../app/store';
    import generateDemoData from '../app/demo';
    import Chart from 'svelte-frappe-charts';
    import Modal from '../components/Modal.svelte';
    import { getContext, onMount, onDestroy } from 'svelte';
    import SvelteTooltip from 'svelte-tooltip';
    import { toast } from '@zerodevx/svelte-toast';
    import { navigate } from 'svelte-routing';

    import ProfileCard from '../components/ProfileCard.svelte';
    import Card from '../components/Card.svelte';
    import FunFact from '../components/FunFact.svelte';
    import Leaderboard from '../components/Leaderboard.svelte';
    import LeaderboardItem from '../components/LeaderboardItem.svelte';

    let timeout;

    onMount(() => {
        if (window.location.href.includes('/demo')) {

            const demoData = generateDemoData();
            data.set(demoData);

        } else if ($data) {
            toast.push('Your data has been loaded!', {
                theme: {
                    '--toastBackground': '#48BB78',
                    '--toastProgressBackground': '#2F855A'
                }
            });

            timeout = setTimeout(() => {
                showModal('<div style="text-align: center">Like what you see?<br><a href="https://androz2091.fr/discord" target="_blank">Support us by saying hello and sharing your stats in our Discord server!<a></div>');
            }, 10000);
        } else navigate('/');
    });

    onDestroy(() => timeout && clearTimeout(timeout));

    const { open } = getContext('simple-modal');

    const showModal = (message) => {
        open(Modal, { message });
    };

    const hoursLabels = new Array(24).fill(0).map((v, i) => i == 0 ? '12am' : i < 12 ? `${i}am` : i == 12 ? '12pm' : `${i-12}pm`);
    </script>

    <div class="statistics" transition:blur>
        {#if $data}
            <div class="cards">
                <Card name="first">
                    <FunFact
                        svg="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        content="You sent % messages"
                        count="{ $data.totalMessageCount }"
                        explanation="Well, you know a lot of people!"
                    />
                </Card>
            </div>
        {/if}
    </div>

    <style>
        .statistics {
            margin-top: 5rem;
            color: white;
            padding: 20px;
        }

        h3 {
            margin-left: 10px;
        }

        .cards {
            display: grid;
            grid-gap: 10px;
        }

        .contributors {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;

            margin-top: 5px;

            border-radius: 10px;
        }

        .contributors-item {
            width: 50px;
            height: 50px;

            margin-top: 5px;
            margin-bottom: 5px;
            margin-right: 5px;
            margin-left: 5px;

            border-radius: 100%;
            background-color: #373c42;
            background-size: contain;
            cursor: pointer;
        }

        @media (min-width: 600px) {
            .cards {
                grid-template-columns: repeat(11, 1fr);
            }
        }
    </style>
