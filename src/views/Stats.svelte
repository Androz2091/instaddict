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
                <Card name="profile" title="About you">
                    <ProfileCard
                        name={ $data.username }
                        profilePicture={ $data.profilePicture }
                    />
                </Card>
                <Card name="first" title="Social Interactions">
                    <FunFact
                        svg="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        content="You talked to % distinct persons"
                        count="{ $data.totalUserCount }"
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
                <Card name="second" title="Messages types">
                    <FunFact
                        svg="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        content="You liked % messages"
                        count="{ $data.totalLikedMessageCount }"
                    />
                    <FunFact svg="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
                        <h3 slot="content">Your favorite words are
                            <span class="text-discord"><SvelteTooltip tip="Used {$data.favoriteWords[0].count.toLocaleString('en-US')} times" bottom color="#000000"><span class="text-discord">{$data.favoriteWords[0].word}</SvelteTooltip></span> and
                            <span class="text-discord"><SvelteTooltip tip="Used {$data.favoriteWords[1].count.toLocaleString('en-US')} times" bottom color="#000000">{$data.favoriteWords[1].word}</SvelteTooltip></span>
                        </h3>
                    </FunFact>
                    <FunFact
                        content="You sent % photos"
                        explanation="and you received { $data.totalPhotoCountReceived.toLocaleString('en-US') } photos!"
                        count="{ $data.totalPhotoCountSent }"
                    >
                        <svg slot="icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </FunFact>
                </Card>
                <Card name="hours" title="Your Instagram Hours">
                    <p>{ hoursLabels[$data.hoursValues.indexOf(Math.max(...$data.hoursValues))] } is definitely your favorite hour to chat with your friends!</p>
                    <Chart data={{
                        labels: hoursLabels,
                        datasets: [
                            {
                                name: 'messages',
                                values: $data.hoursValues
                            }
                        ]
                    }}
                    axisOptions="{{
                        xAxisMode: 'tick'
                    }}"
                    type="bar" />
                </Card>
                <Card name="top-users" title="Top Users/Groups">
                    <p>Groups, sorted by the <b>received</b> messages count ⬇️</p>
                    <Chart data={{
                        labels: $data.topGroups.map((group) => group.name),
                        datasets: [
                            {
                                name: 'messages',
                                values: $data.topGroups.map((group) => group.messageCount)
                            }
                        ]
                    }} maxSlices={7} type="donut" />
                    <p>Groups, sorted by the <b>sent</b> messages count ⬆️</p>
                    <Chart data={{
                        labels: $data.topActiveGroups.map((group) => group.name),
                        datasets: [
                            {
                                name: 'messages',
                                values: $data.topActiveGroups.map((group) => group.sentMessageCount)
                            }
                        ]
                    }} maxSlices={7} type="donut" />
                </Card>
                <Card name="months" title="Your Instagram Moments">
                    <p>You were the most active on Instagram on { $data.messagesMonths.monthsLabels[$data.messagesMonths.monthsValues.indexOf(Math.max(...$data.messagesMonths.monthsValues))] }!</p>
                    <Chart data={{
                        labels: $data.messagesMonths.monthsLabels,
                        datasets: [
                            {
                                name: 'messages',
                                values: $data.messagesMonths.monthsValues
                            }
                        ]
                    }} axisOptions="{{
                        xAxisMode: 'tick'
                    }}" 
                    lineOptions="{{
                        dotSize: 4
                    }}" type="line" />
                </Card>
                <Card name="followers" title="Your Instagram Followers">
                    <p>{ $data.followersValues[$data.followersValues.length-1] } users are currently following you!</p>
                    <Chart data={{
                        labels: $data.followersLabels,
                        datasets: [
                            {
                                name: 'followers',
                                values: $data.followersValues
                            }
                        ]
                    }} axisOptions="{{
                        xAxisMode: 'tick',
                        xIsSeries: true
                    }}"
                    lineOptions="{{
                        dotSize: 4,
                        hideDots: true,
                        spline: true
                    }}" type="line" />
                </Card>

                <Card name="ecology" title="Ecology">
                    <FunFact
                        svg="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        content="You sent % of photos"
                        count="{ $data.totalPhotoSize }"
                    />
                    <FunFact
                        svg="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        content="You sent % of voice messages"
                        count="{ $data.totalVoiceMessagesSize }"
                    />
                    <FunFact
                        svg="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                        content="You posted % of stories/posts"
                        count="{ $data.totalMediaSize }"
                    />
                </Card>
                <Card name="security" title="Security">
                    <FunFact
                        svg="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        content="% password changes"
                        count="{ $data.totalPasswordChangeCount }"
                    />
                    <FunFact
                        svg="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        content="% logins"
                        count="{ $data.totalLoginCount }"
                    />
                    <FunFact
                        svg="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        content="% logouts"
                        count="{ $data.totalLogoutCount }"
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

        h3 {
            margin-left: 10px;
        }

        @media (min-width: 600px) {
            .cards {
                grid-template-columns: repeat(11, 1fr);
            }
        }
    </style>
