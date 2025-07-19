<script>
    import { blur } from 'svelte/transition';
    import { data, restoreFromLocalStorage } from '../app/store';
    import generateDemoData from '../app/demo';
    import Chart from 'svelte-frappe-charts';
    import Modal from '../components/Modal.svelte';
    import { onMount, onDestroy } from 'svelte';
    import SvelteTooltip from 'svelte-tooltip';
    import { toast } from '@zerodevx/svelte-toast';
    import { navigate } from 'svelte-routing';


    import Leaderboard from '../components/Leaderboard.svelte';
    import LeaderboardItem from '../components/LeaderboardItem.svelte';

    let timeout;
    let showModalComponent = false;
    let modalMessage = '';

    onMount(() => {
        const successPopup = () => {
            toast.push('Your data has been loaded!', {
                theme: {
                    '--toastBackground': '#48BB78',
                    '--toastProgressBackground': '#2F855A'
                }
            });

            timeout = setTimeout(() => {
                showModal('<div style="text-align: center">Like what you see?<br><a href="https://androz2091.fr/discord" target="_blank">Support us by saying hello and sharing your stats in our Discord server!<a></div>');
            }, 10000);
        };

        if (window.location.href.includes('/demo')) {
            const demoData = generateDemoData();
            data.set(demoData);
        } else if (!$data) {
            const restored = restoreFromLocalStorage();
            if (!restored) return navigate('/');
        }
        
        successPopup();
    });

    onDestroy(() => timeout && clearTimeout(timeout));

    const showModal = (message) => {
        modalMessage = message;
        showModalComponent = true;
    };
    
    const closeModal = () => {
        showModalComponent = false;
        modalMessage = '';
    };

    const hoursLabels = new Array(24).fill(0).map((v, i) => i == 0 ? '12am' : i < 12 ? `${i}am` : i == 12 ? '12pm' : `${i-12}pm`);
</script>

    <div class="statistics" transition:blur>
        {#if $data}
            <div class="container">
                <header class="stats-header">
                    <div class="header-content">
                        <h1 class="main-title">Instagram Analytics</h1>
                        <p class="subtitle">Discover insights about your Instagram activity and engagement</p>
                    </div>
                </header>

                <section class="profile-hero">
                    <div class="profile-container">
                        <div class="profile-avatar">
                            <img 
                                src={$data.profilePicture ? `data:image/jpg;base64,${$data.profilePicture}` : '/avatar.png'} 
                                alt="Profile" 
                                class="avatar-image"
                                on:error={(e) => { e.target.src = '/avatar.png'; }}
                            />
                            <div class="avatar-ring"></div>
                        </div>
                        <div class="profile-info">
                            <h2 class="profile-name">{$data.username}</h2>
                            <p class="profile-title">Instagram Analytics Dashboard</p>
                            <div class="profile-stats">
                                <div class="quick-stat">
                                    <span class="stat-value">{$data.totalMessageCount.toLocaleString()}</span>
                                    <span class="stat-label">Messages Sent</span>
                                </div>
                                <div class="quick-stat">
                                    <span class="stat-value">{$data.totalUserCount.toLocaleString()}</span>
                                    <span class="stat-label">Conversations</span>
                                </div>
                                <div class="quick-stat">
                                    <span class="stat-value">{$data.totalLikedMessageCount.toLocaleString()}</span>
                                    <span class="stat-label">Likes Given</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="stats-section">
                    <h2 class="section-title">📊 Overview</h2>
                    <div class="charts-grid">
                        <div class="stat-card">
                            <div class="card-header">
                                <h3>Social Interactions</h3>
                                <div class="header-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="card-content">
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                                        </svg>
                                    </div>
                                    <div class="stat-info">
                                        <h4>You talked to <span class="highlight">{$data.totalUserCount.toLocaleString()}</span> distinct persons</h4>
                                        <p>Well, you know a lot of people!</p>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                        </svg>
                                    </div>
                                    <div class="stat-info">
                                        <h4>You sent <span class="highlight">{$data.totalMessageCount.toLocaleString()}</span> messages</h4>
                                        <p>and you received {$data.totalMessageCountReceived.toLocaleString()} messages!</p>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                                        </svg>
                                    </div>
                                    <div class="stat-info">
                                        <h4>You recorded <span class="highlight">{$data.totalVoiceMessagesMinutes.toLocaleString()}</span> min of voice messages</h4>
                                        <p>and you received {$data.totalVoiceMessagesMinutesReceived.toLocaleString()} min of voice messages!</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="card-header">
                                <h3>Message Types</h3>
                                <div class="header-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="card-content">
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                        </svg>
                                    </div>
                                    <div class="stat-info">
                                        <h4>You liked <span class="highlight">{$data.totalLikedMessageCount.toLocaleString()}</span> messages</h4>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                        </svg>
                                    </div>
                                    <div class="stat-info">
                                        <h4>Your favorite words are 
                                            <span class="highlight favorite-word" title="Used {$data.favoriteWords[0].count} times">{$data.favoriteWords[0].word}</span> and 
                                            <span class="highlight favorite-word" title="Used {$data.favoriteWords[1].count} times">{$data.favoriteWords[1].word}</span>
                                        </h4>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                                            <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                    </div>
                                    <div class="stat-info">
                                        <h4>You sent <span class="highlight">{$data.totalPhotoCountSent.toLocaleString()}</span> photos</h4>
                                        <p>and you received {$data.totalPhotoCountReceived.toLocaleString()} photos!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="stats-section">
                    <h2 class="section-title">📈 Analytics</h2>
                    <div class="stats-grid">
                        <div class="chart-card">
                            <div class="card-header">
                                <h3>Your Instagram Hours</h3>
                                <div class="header-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 6v6l4 2"/>
                                        <circle cx="12" cy="12" r="10"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="card-content">
                                <div class="chart-info">
                                    <div class="peak-info">
                                        <span class="peak-hour">{hoursLabels[$data.hoursValues.indexOf(Math.max(...$data.hoursValues))]}</span>
                                        <span class="peak-label">is your peak activity hour!</span>
                                    </div>
                                    <div class="peak-stats">
                                        <span class="peak-count">{Math.max(...$data.hoursValues)}</span>
                                        <span class="peak-unit">messages</span>
                                    </div>
                                </div>
                                <div class="chart-wrapper">
                                    <Chart data={{
                                        labels: hoursLabels,
                                        datasets: [
                                            {
                                                name: 'Messages',
                                                values: $data.hoursValues
                                            }
                                        ]
                                    }}
                                    axisOptions="{{
                                        xAxisMode: 'tick'
                                    }}"
                                    colors={['#E1306C']}
                                    type="bar" />
                                </div>
                            </div>
                        </div>
                        <div class="chart-card">
                            <div class="card-header">
                                <h3>Top Conversations</h3>
                                <div class="header-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="card-content">
                                <div class="chart-section">
                                    <div class="section-header">
                                        <span class="section-icon">📥</span>
                                        <h4>Most Active Conversations (Received)</h4>
                                    </div>
                                    <div class="chart-wrapper">
                                        <Chart data={{
                                            labels: $data.topGroups.map((group) => group.name),
                                            datasets: [
                                                {
                                                    name: 'Messages Received',
                                                    values: $data.topGroups.map((group) => group.messageCount)
                                                }
                                            ]
                                        }} 
                                        maxSlices={6} 
                                        colors={['#E1306C', '#F56040', '#FCAF45', '#4CAF50', '#2196F3', '#9C27B0']}
                                        type="donut" />
                                    </div>
                                </div>
                                <div class="chart-section">
                                    <div class="section-header">
                                        <span class="section-icon">📤</span>
                                        <h4>Most Active Conversations (Sent)</h4>
                                    </div>
                                    <div class="chart-wrapper">
                                        <Chart data={{
                                            labels: $data.topActiveGroups.map((group) => group.name),
                                            datasets: [
                                                {
                                                    name: 'Messages Sent',
                                                    values: $data.topActiveGroups.map((group) => group.sentMessageCount)
                                                }
                                            ]
                                        }} 
                                        maxSlices={6} 
                                        colors={['#F56040', '#E1306C', '#FCAF45', '#2196F3', '#4CAF50', '#9C27B0']}
                                        type="donut" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="chart-card">
                            <div class="card-header">
                                <h3>Activity Timeline</h3>
                                <div class="header-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M3 3v18h18"/>
                                        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="card-content">
                                <div class="chart-info">
                                    <div class="peak-info">
                                        <span class="peak-month">{$data.messagesMonths.monthsLabels[$data.messagesMonths.monthsValues.indexOf(Math.max(...$data.messagesMonths.monthsValues))]}</span>
                                        <span class="peak-label">Peak activity month</span>
                                    </div>
                                    <div class="total-stats">
                                        <span class="total-count">{$data.messagesMonths.monthsValues.reduce((a, b) => a + b, 0).toLocaleString()}</span>
                                        <span class="total-unit">total messages</span>
                                    </div>
                                </div>
                                <div class="chart-wrapper">
                                    <Chart data={{
                                        labels: $data.messagesMonths.monthsLabels,
                                        datasets: [
                                            {
                                                name: 'Messages',
                                                values: $data.messagesMonths.monthsValues
                                            }
                                        ]
                                    }} 
                                    axisOptions="{{
                                        xAxisMode: 'tick'
                                    }}" 
                                    lineOptions="{{
                                        dotSize: 6,
                                        regionFill: 1
                                    }}" 
                                    colors={['#E1306C']}
                                    type="line" />
                                </div>
                            </div>
                        </div>

                        <div class="chart-card">
                            <div class="card-header">
                                <h3>Follower Growth</h3>
                                <div class="header-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
                                        <circle cx="9" cy="7" r="4"/>
                                        <path d="M22 21v-2a4 4 0 00-3-3.87"/>
                                        <path d="M16 3.13a4 4 0 010 7.75"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="card-content">
                                <div class="follower-stats">
                                    <div class="follower-stat">
                                        <span class="follower-number">{$data.followersValues[$data.followersValues.length-1].toLocaleString()}</span>
                                        <span class="follower-label">Current Followers</span>
                                    </div>
                                    <div class="follower-stat">
                                        <span class="follower-growth">+{($data.followersValues[$data.followersValues.length-1] - $data.followersValues[0]).toLocaleString()}</span>
                                        <span class="follower-label">Total Growth</span>
                                    </div>
                                </div>
                                <div class="chart-wrapper">
                                    <Chart data={{
                                        labels: $data.followersLabels,
                                        datasets: [
                                            {
                                                name: 'Followers',
                                                values: $data.followersValues
                                            }
                                        ]
                                    }} 
                                    axisOptions="{{
                                        xAxisMode: 'tick',
                                        xIsSeries: true
                                    }}"
                                    lineOptions="{{
                                        dotSize: 4,
                                        hideDots: true,
                                        spline: true,
                                        regionFill: 1
                                    }}" 
                                    colors={['#F56040']}
                                    type="line" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="stats-section">
                    <h2 class="section-title">🔒 Security & Environment</h2>
                    <div class="stats-grid">

                        <div class="stat-card ecology">
                            <div class="card-header">
                                <h3>Ecology</h3>
                                <div class="header-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 2a10 10 0 1010 10 4 4 0 01-5-5 4 4 0 01-5-5"/>
                                        <path d="M8.5 8.5v.01"/>
                                        <path d="M16 15.5v.01"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="card-content">
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                        </svg>
                                    </div>
                                    <div class="stat-info">
                                        <h3>You sent <span class="highlight">{$data.totalPhotoSize}</span> of photos</h3>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                                        </svg>
                                    </div>
                                    <div class="stat-info">
                                        <h3>You sent <span class="highlight">{$data.totalVoiceMessagesSize}</span> of voice messages</h3>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
                                        </svg>
                                    </div>
                                    <div class="stat-info">
                                        <h3>You posted <span class="highlight">{$data.totalMediaSize}</span> of stories/posts</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="stat-card security">
                            <div class="card-header">
                                <h3>Security</h3>
                                <div class="header-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="card-content">
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                                        </svg>
                                    </div>
                                    <div class="stat-info">
                                        <h3><span class="highlight">{$data.totalPasswordChangeCount.toLocaleString()}</span> password changes</h3>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                                        </svg>
                                    </div>
                                    <div class="stat-info">
                                        <h3><span class="highlight">{$data.totalLoginCount.toLocaleString()}</span> logins</h3>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                        </svg>
                                    </div>
                                    <div class="stat-info">
                                        <h3><span class="highlight">{$data.totalLogoutCount.toLocaleString()}</span> logouts</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="stats-section">
                    <h2 class="section-title">🎯 Engagement & Interactions</h2>
                    <div class="stats-grid">
                        <div class="stat-card story-interactions">
                            <div class="card-header">
                                <h3>Story Interactions</h3>
                                <div class="header-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                                        <line x1="9" y1="9" x2="9.01" y2="9"/>
                                        <line x1="15" y1="9" x2="15.01" y2="9"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="card-content">
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                        </svg>
                                    </div>
                                    <div class="stat-info">
                                        <h3><span class="highlight">{$data.totalPollAnsweredCount.toLocaleString()}</span> polls answered</h3>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </div>
                                    <div class="stat-info">
                                        <h3><span class="highlight">{$data.totalQuizAnsweredCount.toLocaleString()}</span> quizzes answered</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="stat-card social-engagement">
                            <div class="card-header">
                                <h3>Social Engagement</h3>
                                <div class="header-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="card-content">
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                        </svg>
                                    </div>
                                    <div class="stat-info">
                                        <h3><span class="highlight">{$data.totalLikedPostsCount.toLocaleString()}</span> posts liked</h3>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                        </svg>
                                    </div>
                                    <div class="stat-info">
                                        <h3><span class="highlight">{$data.totalCommentsCount.toLocaleString()}</span> comments posted</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        {/if}
    </div>
    
    {#if showModalComponent}
        <Modal message={modalMessage} on:close={closeModal} />
    {/if}

    <style>
        .statistics {
            margin-top: 6rem;
            padding: 2rem;
            max-width: 1400px;
            margin-left: auto;
            margin-right: auto;
            min-height: 100vh;
            position: relative;
            overflow: hidden;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .stats-section {
            margin-bottom: 5rem;
        }
        
        .section-title {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 2rem;
            text-align: center;
            background: linear-gradient(45deg, #fff, #e0e0e0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .statistics::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 0;
        }
        
        .statistics > * {
            position: relative;
            z-index: 1;
        }
        
        .stats-header {
            text-align: center;
            margin-bottom: 4rem;
            padding: 3rem 0;
            position: relative;
        }
        
        header {
            text-align: center;
            margin-bottom: 4rem;
            padding: 2rem 0;
        }
        
        .stats-header::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(225, 48, 108, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            z-index: -1;
        }
        
        .stats-header h1 {
            font-size: 3.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #E1306C, #F56040, #FCAF45);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0;
            letter-spacing: -0.02em;
            text-shadow: 0 4px 20px rgba(225, 48, 108, 0.3);
        }
        
        header h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #fff, #f0f0f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.02em;
        }
        
        .subtitle {
            font-size: 1.3rem;
            color: rgba(255, 255, 255, 0.7);
            margin-top: 1rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            font-weight: 400;
            line-height: 1.6;
        }

        .stats-grid {
            display: grid;
            grid-gap: 2.5rem;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .charts-grid {
            display: grid;
            grid-gap: 3rem;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .stat-card, .chart-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 2.5rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .stat-card:hover, .chart-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
            border-color: rgba(225, 48, 108, 0.3);
        }
        
        .profile-hero {
            margin-bottom: 4rem;
            padding: 3rem 0;
            background: linear-gradient(135deg, rgba(225, 48, 108, 0.1), rgba(245, 96, 64, 0.05));
            border-radius: 32px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
            position: relative;
            overflow: hidden;
        }
        
        .profile-hero::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(225, 48, 108, 0.05) 0%, transparent 70%);
            animation: rotate 20s linear infinite;
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .profile-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4rem;
            max-width: 800px;
            margin: 0 auto;
            padding: 0 2rem;
            position: relative;
            z-index: 1;
        }
        
        .profile-avatar {
            position: relative;
            flex-shrink: 0;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .avatar-image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(225, 48, 108, 0.3);
            transition: all 0.3s ease;
            display: block;
            position: relative;
            z-index: 2;
            background: rgba(255, 255, 255, 0.1);
        }
        
        .avatar-image:hover {
            transform: scale(1.05);
            box-shadow: 0 12px 40px rgba(225, 48, 108, 0.4);
        }
        
        .avatar-ring {
            position: absolute;
            top: -8px;
            left: -8px;
            right: -8px;
            bottom: -8px;
            border: 2px solid transparent;
            border-radius: 50%;
            background: linear-gradient(45deg, #E1306C, #F56040, #FCAF45) border-box;
            mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
        }
        
        .profile-info {
            text-align: left;
            flex: 1;
        }
        
        .profile-name {
            font-size: 3rem;
            font-weight: 800;
            margin: 0 0 0.5rem 0;
            background: linear-gradient(135deg, #E1306C, #F56040, #FCAF45);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.02em;
            text-shadow: 0 4px 20px rgba(225, 48, 108, 0.3);
        }
        
        .profile-title {
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0.7);
            margin: 0 0 2rem 0;
            font-weight: 400;
        }
        
        .profile-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
        }
        
        .quick-stat {
            text-align: center;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        
        .quick-stat:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .stat-value {
            display: block;
            font-size: 1.8rem;
            font-weight: 700;
            color: #E1306C;
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.6);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 500;
        }
        

        .chart-section {
            margin-bottom: 2.5rem;
        }
        
        .chart-section:last-child {
            margin-bottom: 0;
        }
        

        
        .section-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }
        
        .section-header h4 {
            margin: 0;
            font-size: 1.1rem;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
        }
        
        .section-icon {
            font-size: 1.4rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, rgba(225, 48, 108, 0.1), rgba(245, 96, 64, 0.05));
            border-radius: 10px;
            border: 1px solid rgba(225, 48, 108, 0.2);
            box-shadow: 0 2px 8px rgba(225, 48, 108, 0.1);
        }
        
        .header-content {
            text-align: center;
        }
        


        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }



        .card-header h3 {
            font-size: 1.4rem;
            font-weight: 600;
            margin: 0;
            background: linear-gradient(45deg, #fff, #e0e0e0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .header-icon {
            width: 40px;
            height: 40px;
            padding: 10px;
            background: linear-gradient(135deg, rgba(225, 48, 108, 0.2), rgba(245, 96, 64, 0.1));
            border-radius: 16px;
            border: 1px solid rgba(225, 48, 108, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(225, 48, 108, 0.2);
        }

        .header-icon svg {
            width: 20px;
            height: 20px;
            stroke: #E1306C;
            stroke-width: 2.5;
            filter: drop-shadow(0 2px 4px rgba(225, 48, 108, 0.3));
        }

        .card-content {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .stat-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1.25rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
        }
        
        .stat-item:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(225, 48, 108, 0.2);
            transform: translateX(5px);
        }

        .stat-icon {
            width: 40px;
            height: 40px;
            padding: 10px;
            background: linear-gradient(135deg, rgba(225, 48, 108, 0.15), rgba(245, 96, 64, 0.1));
            border-radius: 12px;
            border: 1px solid rgba(225, 48, 108, 0.25);
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(225, 48, 108, 0.15);
        }

        .stat-icon svg {
            width: 20px;
            height: 20px;
            stroke: #E1306C;
            stroke-width: 2.5;
            filter: drop-shadow(0 1px 2px rgba(225, 48, 108, 0.2));
        }

        .stat-info {
            flex: 1;
        }

        .stat-info h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1rem;
            font-weight: 500;
            color: #ffffff;
            line-height: 1.4;
        }

        .stat-info h4 {
            margin: 0 0 0.5rem 0;
            font-size: 1rem;
            font-weight: 500;
            color: #ffffff;
            line-height: 1.4;
        }

        .stat-info p {
            margin: 0;
            font-size: 0.875rem;
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.4;
        }

        .highlight {
            color: #E1306C;
            font-weight: 700;
            font-size: 1.1em;
        }
        
        .favorite-word {
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 6px;
            padding: 2px 6px;
            margin: 0 2px;
        }
        
        .favorite-word:hover {
            background: rgba(225, 48, 108, 0.2);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(225, 48, 108, 0.3);
        }
        
        .favorite-word::after {
            content: attr(title);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 500;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            margin-bottom: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .favorite-word:hover::after {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(-4px);
        }
        

        
        .stat-label {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 500;
        }
        
        .chart-card {
            grid-column: span 1;
        }
        
        .chart-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chart-wrapper {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            overflow: visible;
            position: relative;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            min-height: 450px;
            margin-top: 1rem;
            padding-bottom: 3rem;
        }

        .peak-info {
            text-align: center;
            margin-bottom: 1rem;
        }
        
        .peak-hour, .peak-month {
            display: block;
            font-size: 1.4rem;
            font-weight: 600;
            color: #E1306C;
            margin-bottom: 0.3rem;
        }
        
        .peak-label {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .peak-stats {
            text-align: center;
        }
        
        .peak-count {
            display: block;
            font-size: 1.2rem;
            font-weight: 600;
            color: #F56040;
            margin-bottom: 0.3rem;
        }
        
        .peak-unit {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .total-stats {
            text-align: center;
        }
        
        .total-count {
            display: block;
            font-size: 1.2rem;
            font-weight: 600;
            color: #F56040;
            margin-bottom: 0.3rem;
        }
        
        .total-unit {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .follower-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .follower-stat {
            text-align: center;
        }
        
        .follower-number, .follower-growth {
            display: block;
            font-size: 1.2rem;
            font-weight: 600;
            color: #F56040;
            margin-bottom: 0.3rem;
        }
        
        .follower-label {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .chart-wrapper :global(.frappe-chart) {
            background: transparent !important;
            border-radius: 16px;
            overflow: visible !important;
        }
        
        .chart-wrapper :global(.frappe-chart .chart-container) {
            overflow: visible !important;
        }
        
        .chart-wrapper :global(.frappe-chart .axis) {
            color: rgba(255, 255, 255, 0.6) !important;
        }
        
        .chart-wrapper :global(.frappe-chart .axis-line) {
            stroke: rgba(255, 255, 255, 0.1) !important;
        }
        
        .chart-wrapper :global(.frappe-chart .tick) {
            color: rgba(255, 255, 255, 0.6) !important;
        }
        
        .chart-wrapper :global(.frappe-chart .legend-dataset-text) {
            color: rgba(255, 255, 255, 0.9) !important;
            font-size: 12px !important;
            font-weight: 500 !important;
        }
        
        .chart-wrapper :global(.frappe-chart .legend) {
            overflow: visible !important;
            white-space: nowrap !important;
        }
        
        .chart-wrapper :global(.frappe-chart .legend .legend-dataset) {
            margin-right: 15px !important;
            margin-bottom: 8px !important;
            display: inline-flex !important;
            align-items: center !important;
        }
        
        .chart-wrapper :global(.frappe-chart .legend .legend-dot) {
            margin-right: 6px !important;
            width: 8px !important;
            height: 8px !important;
        }

        h3 {
            margin-left: 0;
            color: rgba(255, 255, 255, 0.95);
        }

        @media (min-width: 768px) {
            .stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            }
            
            .statistics {
                padding: 3rem 2rem;
            }
            
            .stats-header h1 {
                font-size: 4rem;
            }
        }
        
        @media (min-width: 1024px) {
            .stats-grid {
                grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
                grid-gap: 3rem;
            }
            
            .statistics {
                padding: 4rem 3rem;
            }
        }

        @media (min-width: 1200px) {
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .chart-card {
                grid-column: span 1;
            }
        }
        
        @media (max-width: 768px) {
            .statistics {
                padding: 1rem;
            }

            .container {
                padding: 0 1rem;
            }

            header {
                margin-bottom: 3rem;
                padding: 1rem 0;
            }

            header h1 {
                font-size: 2.5rem;
            }

            .section-title {
                font-size: 1.5rem;
                margin-bottom: 1.5rem;
            }

            .stats-section {
                margin-bottom: 3rem;
            }

            .stats-grid {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
            
            .charts-grid {
                grid-template-columns: 1fr;
                gap: 2.5rem;
            }

            .stat-card, .chart-card {
                padding: 2rem;
                margin-bottom: 0.5rem;
            }

            .card-header {
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
            }

            .card-header h3 {
                font-size: 1.2rem;
            }

            .chart-info {
                flex-direction: column;
                gap: 1rem;
                padding: 1rem;
            }
            
            .chart-wrapper {
                min-height: 400px;
                padding: 1.5rem;
                padding-bottom: 2.5rem;
            }

            .profile-hero {
                margin-bottom: 3rem;
                padding: 2rem 0;
            }
            
            .profile-container {
                flex-direction: column;
                text-align: center;
                gap: 3rem;
                padding: 0 1rem;
            }
            
            .profile-info {
                text-align: center;
            }
            
            .profile-name {
                font-size: 2.5rem;
            }
            
            .profile-stats {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .quick-stat {
                padding: 1rem;
            }
            
            .stat-value {
                font-size: 1.5rem;
            }
        }
        
        @media (max-width: 767px) {
            .statistics {
                margin-top: 5rem;
                padding: 1.5rem;
            }
            
            .stats-header {
                margin-bottom: 3rem;
                padding: 2rem 0;
            }
            
            .stats-header h1 {
                font-size: 2.5rem;
            }
            
            .subtitle {
                font-size: 1.1rem;
            }
            
            .follower-stats {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
            
            .chart-wrapper {
                padding: 1.5rem;
            }
        }
        
        @media (max-width: 480px) {
            .statistics {
                padding: 1rem;
            }
            
            .stats-header h1 {
                font-size: 2rem;
            }
            
            .subtitle {
                font-size: 1rem;
            }
            
            .chart-info {
                margin-bottom: 1.5rem;
                padding: 1rem;
                flex-direction: column;
                text-align: center;
            }
            

            
            .stat-item {
                padding: 1.5rem 1rem;
                flex-direction: column;
                text-align: center;
                gap: 0.75rem;
            }
            
            .chart-wrapper {
                 padding: 1rem;
                 min-height: 350px;
                 padding-bottom: 2rem;
             }
            
            .header-icon {
                width: 32px;
                height: 32px;
                padding: 8px;
            }
            
            .profile-hero {
                padding: 1.5rem 0;
                margin-bottom: 2rem;
            }
            
            .profile-name {
                font-size: 2rem;
            }
            
            .profile-title {
                font-size: 1rem;
                margin-bottom: 1.5rem;
            }
            
            .avatar-image {
                width: 100px;
                height: 100px;
            }
            
            .quick-stat {
                padding: 0.75rem;
            }
            
            .stat-value {
                font-size: 1.3rem;
            }
            
            .stat-label {
                font-size: 0.8rem;
            }
            
            .header-icon svg {
                width: 16px;
                height: 16px;
            }
            
            .stat-icon {
                width: 32px;
                height: 32px;
                padding: 8px;
            }
            
            .stat-icon svg {
                width: 16px;
                height: 16px;
            }
        }
    </style>
