--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2024-12-03 01:07:25

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
-- TOC entry 221 (class 1259 OID 33153)
-- Name: dates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dates_id_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 33127)
-- Name: dates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dates (
    id bigint DEFAULT nextval('public.dates_id_seq'::regclass) NOT NULL,
    data date NOT NULL,
    notification character varying(255) NOT NULL
);


ALTER TABLE public.dates OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 24944)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    teacher boolean
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 24943)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4812 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 217 (class 1259 OID 33122)
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id bigint DEFAULT nextval('public.users_id_seq'::regclass) NOT NULL,
    user_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255)
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 33151)
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tasks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tasks_id_seq OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 33132)
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id bigint DEFAULT nextval('public.tasks_id_seq'::regclass) NOT NULL,
    name character varying(255) NOT NULL,
    project_id bigint NOT NULL,
    done boolean NOT NULL
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- TOC entry 4648 (class 2604 OID 24947)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4659 (class 2606 OID 33131)
-- Name: dates dates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dates
    ADD CONSTRAINT dates_pkey PRIMARY KEY (id);


--
-- TOC entry 4657 (class 2606 OID 33126)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 4661 (class 2606 OID 33136)
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 4653 (class 2606 OID 24953)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4655 (class 2606 OID 24951)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4662 (class 2606 OID 33137)
-- Name: projects projects_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4663 (class 2606 OID 33142)
-- Name: tasks tasks_project_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_project_id_foreign FOREIGN KEY (project_id) REFERENCES public.projects(id);


-- Completed on 2024-12-03 01:07:25

--
-- PostgreSQL database dump complete
--

