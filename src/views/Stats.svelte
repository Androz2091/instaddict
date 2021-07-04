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
                // TODO: showModal('<div style="text-align: center">Like what you see?<br><a href="https://androz2091.fr/discord" target="_blank">Support us by saying hello and sharing your stats in our Discord server!<a></div>');
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
                <Card name="profile">
                    <ProfileCard
                        name={ $data.username }
                    />
                </Card>
                <Card name="first">
                    <FunFact
                        svg="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        content="You talked to % distinct persons"
                        count="{ $data.totalUsers }"
                        explanation="Well, you know a lot of people!"
                    />
                    <FunFact
                        svg="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        content="You sent % messages"
                        count="{ $data.totalMessageCount }"
                        explanation="and you received { $data.totalMessageCountReceived.toLocaleString('en-US') } messages!"
                    />
                    <FunFact
                        svg="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        content="You recorded % min of voice messages"
                        explanation="and you received { $data.totalVoiceMessagesMinutesReceived.toLocaleString('en-US') } min of voice messages!"
                        count="{ $data.totalVoiceMessagesMinutes }"
                    />
                </Card>
                <Card name="second">
                    <FunFact
                        svg="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        content="You talked to % distinct persons"
                        count="{ $data.totalUsers }"
                        explanation="Well, you know a lot of people!"
                    />
                    <FunFact
                        svg="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        content="You sent % messages"
                        count="{ $data.totalMessageCount }"
                        explanation="and you received { $data.totalMessageCountReceived.toLocaleString('en-US') } messages!"
                    />
                    <FunFact
                        svg="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        content="You recorded % min of voice messages"
                        explanation="and you received { $data.totalVoiceMessagesMinutesReceived.toLocaleString('en-US') } min of voice messages!"
                        count="{ $data.totalVoiceMessagesMinutes }"
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

        .cards {
            display: grid;
            grid-gap: 10px;
        }

        @media (min-width: 600px) {
            .cards {
                grid-template-columns: repeat(11, 1fr);
            }
        }
    </style>
