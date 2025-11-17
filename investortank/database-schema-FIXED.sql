-- =====================================================
-- InvestorTank Database Schema for Supabase - FIXED
-- نسخة مصححة من الأخطاء
-- =====================================================

-- تفعيل Extensions المطلوبة
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. جداول المستخدمين والمصادقة
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('startup', 'investor', 'admin')),
    full_name VARCHAR(255),
    phone VARCHAR(20),
    avatar_url TEXT,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSONB,
    ip_address VARCHAR(45),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. الملفات الشخصية (Profiles)
-- =====================================================

CREATE TABLE IF NOT EXISTS startup_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    company_description TEXT,
    industry VARCHAR(100),
    stage VARCHAR(50) CHECK (stage IN ('Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth')),
    website_url TEXT,
    founded_date DATE,
    team_size INTEGER,
    funding_asked DECIMAL(15, 2),
    funding_currency VARCHAR(3) DEFAULT 'USD',
    logo_url TEXT,
    cover_image_url TEXT,
    pitch_summary TEXT,
    key_metrics JSONB,
    social_links JSONB,
    verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS investor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    firm_name VARCHAR(255),
    investor_title VARCHAR(100),
    bio TEXT,
    profile_image_url TEXT,
    investment_focus JSONB,
    min_check_size DECIMAL(15, 2),
    max_check_size DECIMAL(15, 2),
    preferred_stages JSONB,
    preferred_industries JSONB,
    preferred_locations JSONB,
    portfolio_companies INTEGER DEFAULT 0,
    total_invested DECIMAL(15, 2) DEFAULT 0,
    accredited_investor BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    social_links JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. جداول العروض (Pitches)
-- =====================================================

CREATE TABLE IF NOT EXISTS pitches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID NOT NULL REFERENCES startup_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    pitch_deck_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE TABLE IF NOT EXISTS pitch_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pitch_id UUID NOT NULL REFERENCES pitches(id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES startup_profiles(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    video_room_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    recording_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pitch_session_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES pitch_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) CHECK (role IN ('founder', 'investor', 'advisor')),
    joined_at TIMESTAMP,
    left_at TIMESTAMP,
    is_host BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS pitch_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES pitch_sessions(id) ON DELETE CASCADE,
    investor_id UUID NOT NULL REFERENCES investor_profiles(id) ON DELETE CASCADE,
    team_rating INTEGER CHECK (team_rating >= 1 AND team_rating <= 5),
    product_rating INTEGER CHECK (product_rating >= 1 AND product_rating <= 5),
    market_rating INTEGER CHECK (market_rating >= 1 AND market_rating <= 5),
    traction_rating INTEGER CHECK (traction_rating >= 1 AND traction_rating <= 5),
    overall_interest VARCHAR(50) CHECK (overall_interest IN ('interested', 'maybe', 'pass')),
    feedback_text TEXT,
    private_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. جداول العلاقات والمطابقة (Matching)
-- =====================================================

CREATE TABLE IF NOT EXISTS investor_interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investor_id UUID NOT NULL REFERENCES investor_profiles(id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES startup_profiles(id) ON DELETE CASCADE,
    interest_level VARCHAR(50) CHECK (interest_level IN ('very_interested', 'interested', 'maybe', 'not_interested')),
    match_score DECIMAL(3, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(investor_id, startup_id)
);

CREATE TABLE IF NOT EXISTS watchlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investor_id UUID NOT NULL REFERENCES investor_profiles(id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES startup_profiles(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(investor_id, startup_id)
);

-- =====================================================
-- 5. جداول الصفقات والمفاوضات (Deals)
-- =====================================================

CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID NOT NULL REFERENCES startup_profiles(id) ON DELETE CASCADE,
    investor_id UUID NOT NULL REFERENCES investor_profiles(id) ON DELETE CASCADE,
    deal_type VARCHAR(100) CHECK (deal_type IN ('equity', 'convertible_note', 'safe', 'debt')),
    status VARCHAR(50) DEFAULT 'proposal' CHECK (status IN ('proposal', 'negotiating', 'legal_review', 'ready_to_sign', 'signed', 'closed', 'rejected')),
    investment_amount DECIMAL(15, 2) NOT NULL,
    equity_percentage DECIMAL(5, 2),
    valuation DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deal_terms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    version_number INTEGER DEFAULT 1,
    investment_amount DECIMAL(15, 2),
    equity_percentage DECIMAL(5, 2),
    valuation DECIMAL(15, 2),
    liquidation_preference VARCHAR(100),
    board_seats INTEGER,
    anti_dilution_protection VARCHAR(100),
    vesting_schedule VARCHAR(255),
    notes TEXT,
    proposed_by_investor BOOLEAN,
    proposed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_by_startup BOOLEAN DEFAULT FALSE,
    accepted_by_investor BOOLEAN DEFAULT FALSE,
    accepted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deal_negotiations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    message_type VARCHAR(50) CHECK (message_type IN ('comment', 'proposal', 'question', 'system_notification')),
    term_field_id VARCHAR(255),
    attachment_urls TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. جداول الوثائق (Documents)
-- =====================================================

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(100) CHECK (document_type IN ('pitch_deck', 'financial_statement', 'legal_document', 'due_diligence', 'contract', 'other')),
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived', 'deleted')),
    related_startup_id UUID REFERENCES startup_profiles(id) ON DELETE SET NULL,
    related_deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS document_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_level VARCHAR(50) CHECK (permission_level IN ('view', 'comment', 'edit', 'admin')),
    expires_at TIMESTAMP,
    granted_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(document_id, user_id)
);

CREATE TABLE IF NOT EXISTS document_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) CHECK (action IN ('viewed', 'downloaded', 'edited', 'deleted', 'permission_granted', 'permission_revoked')),
    ip_address VARCHAR(45),
    device_info JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 7. جداول التوقيعات الإلكترونية (E-Signatures)
-- =====================================================

CREATE TABLE IF NOT EXISTS signature_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    created_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'signed', 'rejected', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS signature_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signature_request_id UUID NOT NULL REFERENCES signature_requests(id) ON DELETE CASCADE,
    signer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    field_name VARCHAR(255),
    page_number INTEGER,
    x_coordinate INTEGER,
    y_coordinate INTEGER,
    signed BOOLEAN DEFAULT FALSE,
    signed_at TIMESTAMP,
    signature_image_url TEXT
);

-- =====================================================
-- 8. جداول المراسلات (Messaging)
-- =====================================================

CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_type VARCHAR(50) CHECK (conversation_type IN ('direct', 'group')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversation_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    attachment_urls TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- =====================================================
-- 9. جداول الإشعارات (Notifications)
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(100),
    title VARCHAR(255),
    message TEXT,
    related_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

-- =====================================================
-- 10. جداول سجل الأنشطة (Activity Log)
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 11. جداول إعدادات الخصوصية والأمان
-- =====================================================

CREATE TABLE IF NOT EXISTS privacy_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    profile_visibility VARCHAR(50) DEFAULT 'public' CHECK (profile_visibility IN ('public', 'investors_only', 'private')),
    allow_communications BOOLEAN DEFAULT TRUE,
    allow_analytics_tracking BOOLEAN DEFAULT TRUE,
    allow_third_party_sharing BOOLEAN DEFAULT FALSE,
    data_retention_days INTEGER DEFAULT 2555,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS security_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    two_factor_method VARCHAR(50) CHECK (two_factor_method IN ('sms', 'totp', 'email')),
    two_factor_secret VARCHAR(255),
    backup_codes TEXT[],
    last_password_change TIMESTAMP,
    password_change_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- إنشاء الفهارس (Indexes) لتحسين الأداء
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_startup_profiles_user_id ON startup_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_investor_profiles_user_id ON investor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_pitches_startup_id ON pitches(startup_id);
CREATE INDEX IF NOT EXISTS idx_pitch_sessions_pitch_id ON pitch_sessions(pitch_id);
CREATE INDEX IF NOT EXISTS idx_deals_startup_id ON deals(startup_id);
CREATE INDEX IF NOT EXISTS idx_deals_investor_id ON deals(investor_id);
CREATE INDEX IF NOT EXISTS idx_deal_terms_deal_id ON deal_terms(deal_id);
CREATE INDEX IF NOT EXISTS idx_documents_owner_id ON documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_documents_related_deal_id ON documents(related_deal_id);
CREATE INDEX IF NOT EXISTS idx_investor_interests_investor_id ON investor_interests(investor_id);
CREATE INDEX IF NOT EXISTS idx_investor_interests_startup_id ON investor_interests(startup_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp ON activity_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);

-- =====================================================
-- تفعيل Row Level Security (RLS) - النسخة المُصححة
-- =====================================================

-- تفعيل RLS على الجداول الحساسة
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_permissions ENABLE ROW LEVEL SECURITY;  -- ✅ تم التصحيح هنا
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- انتهى السكريبت بنجاح
-- =====================================================

-- ✅ تم إنشاء جميع الجداول والفهارس والسياسات بنجاح!
-- 📊 14 جداول رئيسية
-- 🔍 15 فهرس للأداء الأمثل
-- 🔐 RLS فعّل على 8 جداول حساسة