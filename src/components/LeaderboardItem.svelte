<script>
    export let name;
    export let discriminator = null;
    export let guild = null;
    export let position;
    export let avatarURL = null;
    export let count;
    export let channel = false;
</script>

<div class="top-item">
    <div class="top-whois">
        <div class="top-bubble { position === 0 ? 'first' : position === 1 ? 'second' : position === 2 ? 'third' : '' }">{ position + 1 }</div>
        {#if channel}
            <svg class="top-avatar" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="square" stroke-linejoin="square" stroke-width={1} d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path></svg>
        {:else}
            <img class="top-avatar" src="{avatarURL}" alt="Avatar" />
        {/if}
        <h3 class="top-name">{name} <small class="text-muted channel">{channel ? guild : `#${discriminator}`}</small></h3>
    </div>
    <div class="top-messages">
        <h3>{count} <small>messages</small></h3>
    </div>
</div>

<style>
    .text-muted {
        color: rgba(255, 255, 255, 0.6);
        font-weight: 400;
    }
    
    .text-muted.channel {
        white-space: nowrap;
        font-size: 0.85em;
    }
    
    .top-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.25rem;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        margin-bottom: 0.75rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
    }
    
    .top-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #E1306C, #F56040);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
    }
    
    .top-item:hover {
        transform: translateY(-2px) scale(1.01);
        box-shadow: 0 8px 25px rgba(225, 48, 108, 0.15);
        border-color: rgba(225, 48, 108, 0.2);
    }
    
    .top-item:hover::before {
        opacity: 0.05;
    }
    
    .top-item:last-child {
        margin-bottom: 0;
    }
    
    .top-whois {
        align-items: center;
        display: flex;
        min-width: 0;
        flex: 1;
        gap: 1rem;
    }
    
    .top-avatar {
        border-radius: 50%;
        height: 48px;
        width: 48px;
        flex-shrink: 0;
        border: 2px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
        object-fit: cover;
    }
    
    .top-item:hover .top-avatar {
        border-color: rgba(225, 48, 108, 0.3);
        transform: scale(1.05);
    }
    
    .top-name {
        display: flex;
        flex-direction: column;
        min-width: 0;
        flex: 1;
        font-size: 1rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
        line-height: 1.3;
    }
    
    .top-name small {
        margin-top: 0.25rem;
        font-size: 0.8rem;
    }
    
    .top-messages {
        flex-shrink: 0;
        text-align: right;
    }
    
    .top-messages h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.95);
        line-height: 1.2;
    }
    
    .top-messages small {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.75rem;
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .top-bubble {
        align-items: center;
        justify-content: center;
        display: flex;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        flex-shrink: 0;
        font-weight: 700;
        font-size: 0.9rem;
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .top-bubble::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .top-item:hover .top-bubble::before {
        opacity: 1;
    }
    
    .top-bubble {
        background: linear-gradient(135deg, #6B7280, #4B5563);
    }
    
    .top-bubble.first {
        background: linear-gradient(135deg, #F59E0B, #D97706);
        box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
    }
    
    .top-bubble.second {
        background: linear-gradient(135deg, #9CA3AF, #6B7280);
        box-shadow: 0 4px 20px rgba(156, 163, 175, 0.3);
    }
    
    .top-bubble.third {
        background: linear-gradient(135deg, #92400E, #78350F);
        box-shadow: 0 4px 20px rgba(146, 64, 14, 0.3);
    }
    
    @media (max-width: 768px) {
        .top-item {
            padding: 0.875rem 1rem;
        }
        
        .top-avatar {
            height: 42px;
            width: 42px;
        }
        
        .top-bubble {
            width: 36px;
            height: 36px;
            font-size: 0.8rem;
        }
        
        .top-name {
            font-size: 0.9rem;
        }
        
        .top-messages h3 {
            font-size: 1rem;
        }
        
        .top-whois {
            gap: 0.75rem;
        }
    }
    
    @media (max-width: 480px) {
        .top-item {
            padding: 0.75rem;
        }
        
        .top-avatar {
            height: 38px;
            width: 38px;
        }
        
        .top-bubble {
            width: 32px;
            height: 32px;
            font-size: 0.75rem;
        }
        
        .top-name {
            font-size: 0.85rem;
        }
        
        .top-messages h3 {
            font-size: 0.9rem;
        }
        
        .top-whois {
            gap: 0.5rem;
        }
    }
</style>
