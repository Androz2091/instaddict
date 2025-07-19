<script>
    export let name;
    export let profilePicture;
</script>

<div class="user-profile">
    <div class="avatar-container">
        <div class="avatar">
            <img src="{profilePicture ? `data:image/jpg;base64,${profilePicture}` : '/avatar.png'}" alt="Avatar" />
        </div>
        <div class="status-indicator"></div>
    </div>
    <div class="user-info">
        <h1 class="username">
            { name || 'Instagram User' }
        </h1>
        <p class="user-badge">Instagram User</p>
    </div>
</div>

<style>
    .user-profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
        backdrop-filter: blur(10px);
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .user-profile::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, #E1306C, #F56040, #FCAF45);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
    }

    .user-profile:hover::before {
        opacity: 0.1;
    }

    .avatar-container {
        position: relative;
        margin-bottom: 1.5rem;
    }

    .avatar {
        position: relative;
        padding: 4px;
        background: linear-gradient(45deg, #E1306C, #F56040, #FCAF45);
        border-radius: 50%;
        transition: transform 0.3s ease;
    }

    .avatar:hover {
        transform: scale(1.05);
    }

    .avatar img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0.9);
        object-fit: cover;
        transition: all 0.3s ease;
    }

    .status-indicator {
        position: absolute;
        bottom: 8px;
        right: 8px;
        width: 20px;
        height: 20px;
        background: linear-gradient(45deg, #4CAF50, #8BC34A);
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0.9);
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
        }
    }

    .user-info {
        text-align: center;
    }

    .username {
        font-size: 2rem;
        font-weight: 700;
        background: linear-gradient(45deg, #E1306C, #F56040);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 0.5rem 0;
        letter-spacing: -0.02em;
    }

    .user-badge {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.9rem;
        font-weight: 500;
        margin: 0;
        padding: 0.5rem 1rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: inline-block;
    }

    @media (max-width: 1200px) {
        .username {
            font-size: 1.8rem;
        }
        
        .avatar img {
            width: 100px;
            height: 100px;
        }
        
        .user-profile {
            padding: 1.5rem;
        }
    }
    
    @media (max-width: 900px) {
        .username {
            font-size: 1.5rem;
        }
        
        .avatar img {
            width: 90px;
            height: 90px;
        }
        
        .user-profile {
            padding: 1.25rem;
        }
    }

    @media screen and (max-width: 600px) {
        .avatar img {
            width: 100px;
            height: 100px;
        }

        .username {
            font-size: 1.8rem;
        }
        
        .user-profile {
            padding: 1.5rem;
        }
        
        .user-badge {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
        }
    }
</style>
