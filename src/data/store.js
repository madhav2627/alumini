// Reactive State Management with LocalStorage Persistence

import {
  ALUMNI_DATA,
  STUDENTS_DATA,
  FACULTY_DATA,
  JOBS_DATA,
  EVENTS_DATA,
  COMMUNITY_POSTS,
  SUCCESS_STORIES,
  MENTORSHIP_REQUESTS,
  CHAPTERS_DATA,
  DONATION_FUNDS,
  POLLS_DATA,
  NOTIFICATIONS_DATA,
  CHAT_CONVERSATIONS
} from './seedData.js';

class AppStore {
  constructor() {
    this.STORAGE_KEY = 'alumniconnect_clean_v4';
    // Clear legacy test data / account caches if present
    try {
      const keysToRemove = [
        'alumniconnect_clean_v3',
        'alumniconnect_fresh_store',
        'alumniconnect_v1_store',
        'alumniconnect_user_store_v3',
        'alumniconnect_state'
      ];
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {}
    this.listeners = new Set();
    this.state = this.loadState();
  }

  loadState() {
    try {
      const cached = localStorage.getItem(this.STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (!parsed.registeredUsers) {
          parsed.registeredUsers = [];
        }
        // Sanitize any stale mock demo accounts if present
        const mockNames = ['Dr. Eleanor Vance', 'Sarah Chen', 'Alex Rivera', 'Prof. Marcus Sterling'];
        parsed.registeredUsers = parsed.registeredUsers.filter(u => !mockNames.includes(u.name));
        if (parsed.currentUser && mockNames.includes(parsed.currentUser.name)) {
          parsed.currentUser = null;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage error, using default clean state', e);
    }

    return {
      currentRole: 'student',
      personas: {},
      registeredUsers: [],
      currentUser: null,
      alumni: ALUMNI_DATA,
      students: STUDENTS_DATA,
      faculty: FACULTY_DATA,
      jobs: JOBS_DATA,
      events: EVENTS_DATA,
      posts: COMMUNITY_POSTS,
      stories: SUCCESS_STORIES,
      mentorshipRequests: MENTORSHIP_REQUESTS,
      chapters: CHAPTERS_DATA,
      funds: DONATION_FUNDS,
      polls: POLLS_DATA,
      notifications: NOTIFICATIONS_DATA,
      chats: CHAT_CONVERSATIONS,
      connections: [],
      pendingConnections: [],
      savedAlumniIds: [],
      darkTheme: false
    };
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // Persona & Role
  getCurrentPersona() {
    if (this.state.currentUser) {
      return {
        id: this.state.currentUser.id,
        name: this.state.currentUser.name,
        role: this.state.currentUser.role || this.state.currentRole,
        title: this.state.currentUser.jobRole || (this.state.currentUser.role ? this.state.currentUser.role.toUpperCase() : 'Member'),
        avatar: this.state.currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        collegeId: this.state.currentUser.collegeId,
        department: this.state.currentUser.department || 'Campus Member',
        gradYear: this.state.currentUser.gradYear || 2024,
        location: this.state.currentUser.location || 'Campus City',
        status: this.state.currentUser.status || 'APPROVED'
      };
    }
    return {
      id: 'guest',
      name: 'Guest Member',
      role: 'guest',
      title: 'Member',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      collegeId: '',
      department: 'Campus Member',
      gradYear: 2024,
      location: 'Campus City',
      status: 'GUEST'
    };
  }

  setCurrentRole(role) {
    this.state.currentRole = role;
    if (this.state.currentUser) {
      this.state.currentUser.role = role;
    }
    this.saveState();
  }

  // Authentication & College ID Handling
  getCurrentUser() {
    return this.state.currentUser || null;
  }

  loginWithCollegeId(collegeId, password) {
    const cleanId = (collegeId || '').trim().toUpperCase();
    const cleanPass = (password || '').trim();

    const user = this.state.registeredUsers?.find(
      u => u.collegeId && u.collegeId.toUpperCase() === cleanId
    );

    if (!user) {
      return { success: false, message: `College ID "${collegeId}" not registered. Please register first.` };
    }

    if (user.password && cleanPass && user.password !== cleanPass) {
      return { success: false, message: 'Incorrect password for this College ID.' };
    }

    this.state.currentUser = user;
    this.state.currentRole = user.role || 'student';
    this.addNotification({
      title: 'Signed in successfully',
      message: `Welcome back, ${user.name}! (College ID: ${user.collegeId})`,
      type: 'login',
      link: '#dashboard'
    });
    this.saveState();
    return { success: true, user };
  }

  logout() {
    this.state.currentUser = null;
    this.saveState();
  }

  registerUser(formData) {
    const collegeId = (formData.studentId || formData.collegeId || `COL-${Date.now().toString().slice(-6)}`).trim().toUpperCase();

    // Check if college ID already exists
    const existing = this.state.registeredUsers?.find(u => u.collegeId && u.collegeId.toUpperCase() === collegeId);
    if (existing) {
      this.state.currentUser = existing;
      this.state.currentRole = existing.role || 'student';
      this.saveState();
      return existing;
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      collegeId: collegeId,
      password: formData.password || 'password123',
      name: formData.name || 'New Member',
      email: formData.email || '',
      phone: formData.phone || '',
      role: formData.role || (Number(formData.gradYear) <= new Date().getFullYear() ? 'alumni' : 'student'),
      department: formData.department || 'Computer Science & Engineering',
      degree: formData.degree || 'B.Tech in Computer Science',
      gradYear: Number(formData.gradYear) || new Date().getFullYear(),
      avatar: formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      company: formData.company || 'Campus Member',
      industry: formData.industry || 'Technology',
      skills: formData.skills || ['Problem Solving', 'Teamwork'],
      bio: formData.bio || 'Proud member of the university alumni and student community.',
      status: 'PENDING_VERIFICATION',
      joinedAt: 'Just now'
    };

    if (!this.state.registeredUsers) {
      this.state.registeredUsers = [];
    }
    this.state.registeredUsers.unshift(newUser);

    // If role is alumni, also populate into alumni directory
    if (newUser.role === 'alumni') {
      const newAlum = {
        id: `alm_${Date.now()}`,
        collegeId: newUser.collegeId,
        name: newUser.name,
        gradYear: newUser.gradYear,
        department: newUser.department,
        degree: newUser.degree,
        company: newUser.company,
        role: formData.jobRole || 'Alumni Member',
        location: formData.location || 'Campus City',
        industry: newUser.industry,
        experienceYears: Number(formData.experienceYears) || 1,
        availableForMentorship: formData.availableForMentorship !== false,
        status: 'PENDING_VERIFICATION',
        rating: 5.0,
        menteesCount: 0,
        avatar: newUser.avatar,
        bio: newUser.bio,
        skills: newUser.skills,
        submittedAt: 'Just now'
      };
      this.state.alumni.unshift(newAlum);
    }

    // Automatically authenticate the new registrant!
    this.state.currentUser = newUser;
    this.state.currentRole = newUser.role;

    this.addNotification({
      title: 'Registration Successful',
      message: `Welcome, ${newUser.name}! Your account is active with College ID: ${newUser.collegeId}.`,
      type: 'registration',
      link: '#dashboard'
    });

    this.addNotification({
      title: 'New Member Registration',
      message: `${newUser.name} (${newUser.collegeId}) registered as ${newUser.role.toUpperCase()}.`,
      type: 'admin',
      link: '#dashboard/admin'
    });

    this.saveState();
    return newUser;
  }

  toggleTheme() {
    this.state.darkTheme = !this.state.darkTheme;
    if (this.state.darkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    this.saveState();
  }

  // Alumni Directory & Verification
  getAlumni(filters = {}) {
    let list = this.state.alumni;

    // By default for students/public, only show APPROVED alumni
    if (this.state.currentRole !== 'admin') {
      list = list.filter(a => a.status === 'APPROVED');
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        (a.skills && a.skills.some(s => s.toLowerCase().includes(q)))
      );
    }

    if (filters.department && filters.department !== 'All') {
      list = list.filter(a => a.department === filters.department);
    }

    if (filters.gradYear && filters.gradYear !== 'All') {
      list = list.filter(a => a.gradYear === Number(filters.gradYear));
    }

    if (filters.industry && filters.industry !== 'All') {
      list = list.filter(a => a.industry === filters.industry);
    }

    if (filters.location && filters.location !== 'All') {
      list = list.filter(a => a.location.includes(filters.location));
    }

    if (filters.mentorshipOnly) {
      list = list.filter(a => a.availableForMentorship);
    }

    return list;
  }

  getAlumniById(id) {
    return this.state.alumni.find(a => a.id === id);
  }

  registerAlumni(formData) {
    const newAlum = {
      id: `alm_${Date.now()}`,
      name: formData.name,
      gradYear: Number(formData.gradYear),
      department: formData.department,
      degree: formData.degree,
      company: formData.company,
      role: formData.role,
      location: formData.location,
      industry: formData.industry,
      experienceYears: Number(formData.experienceYears) || 1,
      availableForMentorship: formData.availableForMentorship || false,
      status: 'PENDING_VERIFICATION',
      rating: 5.0,
      menteesCount: 0,
      avatar: formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bio: formData.bio,
      skills: formData.skills || ['Leadership', 'Problem Solving'],
      submittedAt: 'Just now'
    };

    this.state.alumni.unshift(newAlum);
    this.addNotification({
      title: 'New Alumni Registration',
      message: `${newAlum.name} (${newAlum.company}) submitted a profile for verification.`,
      type: 'registration',
      link: '#dashboard/admin'
    });
    this.saveState();
    return newAlum;
  }

  approveAlumni(id) {
    const target = this.state.alumni.find(a => a.id === id);
    if (target) {
      target.status = 'APPROVED';
      this.addNotification({
        title: 'Alumni Profile Approved',
        message: `${target.name} has been approved and is now visible in the directory.`,
        type: 'verification',
        link: '#alumni'
      });
      this.saveState();
    }
  }

  rejectAlumni(id) {
    this.state.alumni = this.state.alumni.filter(a => a.id !== id);
    this.saveState();
  }

  addAlumniDirect(formData) {
    const newAlum = {
      id: `alm_${Date.now()}`,
      name: formData.name,
      gradYear: Number(formData.gradYear) || new Date().getFullYear(),
      department: formData.department || 'Computer Science & Engineering',
      degree: formData.degree || 'B.Tech',
      company: formData.company || 'Innovator Inc.',
      role: formData.role || 'Senior Engineer',
      location: formData.location || 'Campus City',
      industry: formData.industry || 'Technology',
      experienceYears: Number(formData.experienceYears) || 1,
      availableForMentorship: formData.availableForMentorship !== false,
      status: 'APPROVED',
      rating: 5.0,
      menteesCount: 0,
      avatar: formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      bio: formData.bio || 'Verified university graduate and community contributor.',
      skills: formData.skills || ['Leadership', 'Problem Solving'],
      mentorshipTopics: formData.mentorshipTopics || ['Career Advice', 'Resume Review'],
      submittedAt: 'Just now'
    };
    this.state.alumni.unshift(newAlum);
    this.addNotification({
      title: 'Alumni Profile Added',
      message: `${newAlum.name} has been added directly to verified alumni.`,
      type: 'verification',
      link: '#alumni'
    });
    this.saveState();
    return newAlum;
  }

  // Jobs
  getJobs(filters = {}) {
    let list = this.state.jobs;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        (j.skills && j.skills.some(s => s.toLowerCase().includes(q)))
      );
    }
    if (filters.workType && filters.workType !== 'All') {
      list = list.filter(j => j.workType === filters.workType);
    }
    if (filters.savedOnly) {
      list = list.filter(j => j.saved);
    }
    return list;
  }

  toggleSaveJob(id) {
    const job = this.state.jobs.find(j => j.id === id);
    if (job) {
      job.saved = !job.saved;
      this.saveState();
    }
  }

  applyJob(jobId, candidateNote = '') {
    const job = this.state.jobs.find(j => j.id === jobId);
    if (job) {
      this.addNotification({
        title: 'Application Submitted',
        message: `Your referral application for ${job.title} at ${job.company} was sent!`,
        type: 'job',
        link: '#jobs'
      });
    }
  }

  postJob(jobData) {
    const newJob = {
      id: `job_${Date.now()}`,
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      workType: jobData.workType || 'Full-time',
      experience: jobData.experience || '1-3 years',
      salary: jobData.salary || 'Competitive',
      department: jobData.department || 'General',
      postedBy: this.getCurrentPersona().name + ' (Alumni Referral)',
      postedAt: 'Just now',
      deadline: jobData.deadline || '30 days remaining',
      description: jobData.description,
      skills: jobData.skills || ['Communication', 'Teamwork'],
      saved: false
    };
    this.state.jobs.unshift(newJob);
    this.addNotification({
      title: 'New Career Opportunity',
      message: `${newJob.postedBy} posted ${newJob.title} at ${newJob.company}.`,
      type: 'job',
      link: '#jobs'
    });
    this.saveState();
    return newJob;
  }

  // Events
  getEvents(filters = {}) {
    let list = this.state.events;
    if (filters.category && filters.category !== 'All') {
      list = list.filter(e => e.category === filters.category);
    }
    return list;
  }

  toggleEventRegistration(eventId) {
    const evt = this.state.events.find(e => e.id === eventId);
    if (evt) {
      evt.isRegistered = !evt.isRegistered;
      evt.attendeesCount += evt.isRegistered ? 1 : -1;
      this.saveState();
    }
  }

  createEvent(eventData) {
    const newEvt = {
      id: `evt_${Date.now()}`,
      title: eventData.title,
      category: eventData.category || 'Alumni Meet',
      date: eventData.date,
      time: eventData.time || '10:00 AM EST',
      location: eventData.location,
      isVirtual: eventData.isVirtual || false,
      organizer: this.getCurrentPersona().name,
      attendeesCount: 1,
      isRegistered: true,
      banner: eventData.banner || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      description: eventData.description,
      speakers: eventData.speakers || []
    };
    this.state.events.unshift(newEvt);
    this.saveState();
    return newEvt;
  }

  // Mentorship
  getMentorshipRequests() {
    return this.state.mentorshipRequests;
  }

  sendMentorshipRequest(reqData) {
    const persona = this.getCurrentPersona();
    const newReq = {
      id: `mr_${Date.now()}`,
      studentId: persona.id,
      studentName: persona.name,
      studentAvatar: persona.avatar,
      mentorId: reqData.mentorId,
      mentorName: reqData.mentorName,
      topic: reqData.topic,
      status: 'PENDING',
      message: reqData.message,
      date: 'Just now'
    };
    this.state.mentorshipRequests.unshift(newReq);
    this.addNotification({
      title: 'Mentorship Request Sent',
      message: `Your request was sent to ${reqData.mentorName}.`,
      type: 'mentorship',
      link: '#dashboard/student'
    });
    this.saveState();
  }

  updateMentorshipStatus(id, newStatus) {
    const req = this.state.mentorshipRequests.find(r => r.id === id);
    if (req) {
      req.status = newStatus;
      this.addNotification({
        title: `Mentorship ${newStatus}`,
        message: `Mentorship request with ${req.studentName} is now ${newStatus.toLowerCase()}.`,
        type: 'mentorship',
        link: '#mentorship'
      });
      this.saveState();
    }
  }

  // Community Feed
  getPosts(category = 'All') {
    let list = this.state.posts;
    if (category && category !== 'All') {
      list = list.filter(p => p.category === category);
    }
    return list;
  }

  toggleLikePost(id) {
    const post = this.state.posts.find(p => p.id === id);
    if (post) {
      post.hasLiked = !post.hasLiked;
      post.likesCount += post.hasLiked ? 1 : -1;
      this.saveState();
    }
  }

  addComment(postId, commentText) {
    const post = this.state.posts.find(p => p.id === postId);
    const persona = this.getCurrentPersona();
    if (post && commentText.trim()) {
      post.comments.push({
        id: `c_${Date.now()}`,
        author: persona.name,
        text: commentText.trim(),
        timeAgo: 'Just now'
      });
      this.saveState();
    }
  }

  createPost(postData) {
    const persona = this.getCurrentPersona();
    const newPost = {
      id: `post_${Date.now()}`,
      author: {
        name: persona.name,
        role: persona.title || persona.role,
        avatar: persona.avatar,
        gradYear: persona.gradYear || 2024
      },
      category: postData.category || 'General',
      timeAgo: 'Just now',
      content: postData.content,
      image: postData.image || null,
      likesCount: 0,
      hasLiked: false,
      saved: false,
      comments: []
    };
    this.state.posts.unshift(newPost);
    this.saveState();
    return newPost;
  }

  toggleSavePost(id) {
    const post = this.state.posts.find(p => p.id === id);
    if (post) {
      post.saved = !post.saved;
      this.saveState();
    }
  }

  // Stories
  getStories() {
    return this.state.stories;
  }

  submitStory(data) {
    const persona = this.getCurrentPersona();
    const newStory = {
      id: `story_${Date.now()}`,
      title: data.title,
      alumniName: persona.name,
      gradYear: persona.gradYear || 2020,
      company: persona.company || 'Innovator',
      role: persona.title || 'Alumni Lead',
      avatar: persona.avatar,
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=80',
      readTime: '4 min read',
      summary: data.summary,
      content: data.content
    };
    this.state.stories.unshift(newStory);
    this.saveState();
  }

  // Chapters
  getChapters() {
    return this.state.chapters;
  }

  createChapter(chapterData) {
    const newChapter = {
      id: `ch_${Date.now()}`,
      name: chapterData.name,
      city: chapterData.city || 'Campus City',
      country: chapterData.country || 'USA',
      membersCount: 1,
      isJoined: true,
      banner: chapterData.banner || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
      lead: chapterData.lead || this.getCurrentPersona().name,
      description: chapterData.description || 'Regional community connecting graduates.'
    };
    this.state.chapters.unshift(newChapter);
    this.addNotification({
      title: 'New Regional Chapter Formed',
      message: `${newChapter.name} has been created.`,
      type: 'community',
      link: '#chapters'
    });
    this.saveState();
    return newChapter;
  }

  toggleJoinChapter(id) {
    const ch = this.state.chapters.find(c => c.id === id);
    if (ch) {
      ch.isJoined = !ch.isJoined;
      ch.membersCount += ch.isJoined ? 1 : -1;
      this.saveState();
    }
  }

  // Giving & Donations
  getFunds() {
    return this.state.funds;
  }

  createFund(fundData) {
    const newFund = {
      id: `fund_${Date.now()}`,
      title: fundData.title,
      goal: Number(fundData.goal) || 10000,
      raised: 0,
      donorsCount: 0,
      description: fundData.description,
      donors: []
    };
    this.state.funds.unshift(newFund);
    this.addNotification({
      title: 'New Giving Campaign Launched',
      message: `"${newFund.title}" is now open for alumni contributions.`,
      type: 'donation',
      link: '#donations'
    });
    this.saveState();
    return newFund;
  }

  makeDonation(fundId, amount, customDonor = '') {
    const fund = this.state.funds.find(f => f.id === fundId);
    const donorName = customDonor.trim() || this.getCurrentPersona().name;
    if (fund) {
      fund.raised += Number(amount);
      fund.donorsCount += 1;
      fund.donors.unshift({
        name: donorName,
        amount: `$${Number(amount).toLocaleString()}`,
        timeAgo: 'Just now'
      });
      this.addNotification({
        title: 'Thank you for giving back!',
        message: `Your donation of $${Number(amount).toLocaleString()} to "${fund.title}" was processed.`,
        type: 'donation',
        link: '#donations'
      });
      this.saveState();
    }
  }

  // Polls
  getPolls() {
    return this.state.polls;
  }

  createPoll(pollData) {
    const newPoll = {
      id: `poll_${Date.now()}`,
      question: pollData.question,
      status: 'Active',
      endsAt: pollData.endsAt || 'In 14 days',
      totalVotes: 0,
      userVotedOption: null,
      options: (pollData.options || ['Option A', 'Option B']).map((opt, idx) => ({
        id: `opt_${Date.now()}_${idx}`,
        text: opt,
        votes: 0
      }))
    };
    this.state.polls.unshift(newPoll);
    this.addNotification({
      title: 'New Campus Poll Created',
      message: `"${newPoll.question}" is now live for voting.`,
      type: 'announcement',
      link: '#polls'
    });
    this.saveState();
    return newPoll;
  }

  votePoll(pollId, optionId) {
    const poll = this.state.polls.find(p => p.id === pollId);
    if (poll) {
      // remove prior vote if any
      if (poll.userVotedOption) {
        const prev = poll.options.find(o => o.id === poll.userVotedOption);
        if (prev) prev.votes = Math.max(0, prev.votes - 1);
        poll.totalVotes = Math.max(0, poll.totalVotes - 1);
      }
      const opt = poll.options.find(o => o.id === optionId);
      if (opt) {
        opt.votes += 1;
        poll.totalVotes += 1;
        poll.userVotedOption = optionId;
      }
      this.saveState();
    }
  }

  // Messaging & Chat
  getChats() {
    return this.state.chats;
  }

  sendMessage(chatId, text) {
    const chat = this.state.chats.find(c => c.id === chatId);
    if (chat && text.trim()) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      chat.messages.push({
        id: `m_${Date.now()}`,
        sender: 'me',
        text: text.trim(),
        time: now
      });

      // Simulate realistic auto-reply after 1.5 seconds from contact
      setTimeout(() => {
        const replies = [
          "That sounds wonderful! I'd love to look over your project. Let's set up a quick 20-minute chat this Thursday.",
          "Great question! In our team we prioritize clean interfaces, strong test coverage, and distributed caching.",
          "I will introduce you to our hiring recruiter on Monday. Make sure your GitHub profile highlights your recent work!",
          "Thanks for following up! Happy to help any university juniors navigate this transition."
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        chat.messages.push({
          id: `m_rep_${Date.now()}`,
          sender: 'contact',
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        this.addNotification({
          title: `New message from ${chat.contact.name}`,
          message: randomReply.slice(0, 60) + '...',
          type: 'message',
          link: '#messages'
        });
        this.saveState();
      }, 1400);

      this.saveState();
    }
  }

  // Notifications
  getNotifications() {
    return this.state.notifications;
  }

  addNotification(notif) {
    this.state.notifications.unshift({
      id: `notif_${Date.now()}`,
      unread: true,
      timeAgo: 'Just now',
      ...notif
    });
    this.saveState();
  }

  markAllNotificationsRead() {
    this.state.notifications.forEach(n => n.unread = false);
    this.saveState();
  }

  // Saved Items
  getSavedItems() {
    return {
      alumni: this.state.alumni.filter(a => this.state.savedAlumniIds.includes(a.id)),
      jobs: this.state.jobs.filter(j => j.saved),
      events: this.state.events.filter(e => e.isRegistered),
      posts: this.state.posts.filter(p => p.saved)
    };
  }

  toggleSaveAlumni(id) {
    if (this.state.savedAlumniIds.includes(id)) {
      this.state.savedAlumniIds = this.state.savedAlumniIds.filter(i => i !== id);
    } else {
      this.state.savedAlumniIds.push(id);
    }
    this.saveState();
  }

  // Database Management
  resetDatabase() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem('alumniconnect_clean_v3');
      localStorage.removeItem('alumniconnect_v1_store');
    } catch (e) {}

    this.state = {
      currentRole: 'student',
      personas: {},
      registeredUsers: [],
      currentUser: null,
      alumni: [],
      students: [],
      faculty: [],
      jobs: [],
      events: [],
      posts: [],
      stories: [],
      mentorshipRequests: [],
      chapters: [],
      funds: [],
      polls: [],
      notifications: [],
      chats: [],
      connections: [],
      pendingConnections: [],
      savedAlumniIds: [],
      darkTheme: this.state.darkTheme || false
    };
    this.saveState();
  }

  exportDataJSON() {
    return JSON.stringify(this.state, null, 2);
  }

  importDataJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        this.state = { ...this.state, ...parsed };
        this.saveState();
        return true;
      }
    } catch (e) {
      console.error('Import failed', e);
    }
    return false;
  }
}

export const store = new AppStore();
