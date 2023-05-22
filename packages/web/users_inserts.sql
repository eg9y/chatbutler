--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Debian 15.1-1.pgdg110+1)
-- Dumped by pg_dump version 15.2 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user) VALUES ('00000000-0000-0000-0000-000000000000', '7db601cb-fea3-47f9-9397-5b6f20c06c4e', 'authenticated', 'authenticated', 'egan@hey.com', '$2a$10$JMhTktCDia5pydvdVN6OqO.1mnCVovUyFjb5vaPPEjBryz41XAY9e', '2023-01-10 06:10:44.229239+00', NULL, '', NULL, '', NULL, '', '', NULL, '2023-01-10 06:10:44.233769+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2023-01-10 06:10:44.209321+00', '2023-01-10 06:10:44.239524+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user) VALUES ('00000000-0000-0000-0000-000000000000', '5bb53db3-5ee5-4856-851e-4df162354c92', 'authenticated', 'authenticated', 'brickkace@gmail.com', '$2a$10$81R.oeitGLnBpf9rA7RzA.pTFBnzM4AcComaEd5EdGkrmHkiPNVaK', '2023-04-01 18:13:21.648903+00', NULL, '', NULL, '', NULL, '', '', NULL, '2023-04-01 18:13:21.651032+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2023-04-01 18:13:21.643164+00', '2023-04-01 18:13:21.654797+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user) VALUES ('00000000-0000-0000-0000-000000000000', '1f4295b3-81a2-45d0-aa0c-f3f9811c6ebc', 'authenticated', 'authenticated', 'cendoloverboba@gmail.com', '$2a$10$p3rZ3kOtv.VpRF1D5BI9iu9rg5zQI7CSw8Qy7sfXSdboVXPw3dAJy', '2023-04-01 18:13:35.883157+00', '2023-04-01 18:09:28.263476+00', '', '2023-04-01 18:09:28.263476+00', '', NULL, '', '', NULL, '2023-04-01 18:13:35.883911+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2023-04-01 18:09:28.255281+00', '2023-04-01 18:13:35.885954+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false);


--
-- PostgreSQL database dump complete
--

