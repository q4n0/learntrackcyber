import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Youtube, Terminal, PlayCircle, CheckCircle2,
  GraduationCap, AlertTriangle, BookOpen, Award,
  Code, ArrowRight, Calendar, Mail, Clock, Link,
  BookOpen, VideoIcon, FileText, Repeat
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Utility function for spaced repetition
const calculateNextReview = (level) => {
  const intervals = [1, 3, 7, 14, 30, 90]; // Days until next review
  const nextInterval = intervals[Math.min(level, intervals.length - 1)];
  return new Date(Date.now() + nextInterval * 24 * 60 * 60 * 1000);
};

// Extended learning curriculum
const learningCurriculum = {
  totalDays: 42,
  paths: [
    {
      name: "Linux Fundamentals",
      days: [1, 2, 3, 4],
      resources: {
        videos: [
          {
            creator: "Linux Journey",
            title: "Linux Basics",
            url: "https://www.youtube.com/watch?v=V1y-mbWM3B8",
            duration: "1:22:43",
            keyPoints: [
              "Basic commands",
              "File system navigation",
              "User management"
            ]
          }
        ],
        practiceExercises: [
          {
            title: "File Manipulation",
            difficulty: "Beginner",
            description: "Create, move, and delete files using command line",
            codeTemplate: `
# Your commands here
            `,
            solution: `
mkdir practice
cd practice
touch file1.txt file2.txt
mv file1.txt renamed_file.txt
rm file2.txt
cd ..
rmdir practice
            `
          }
        ]
      },
      reviewTopics: [
        {
          topic: "Basic Linux Commands",
          questions: [
            {
              question: "What command lists files and directories?",
              answer: "ls"
            },
            {
              question: "How do you change directories?",
              answer: "cd [directory]"
            }
          ]
        }
      ]
    },
    {
      name: "Network Basics",
      days: [5, 6, 7],
      resources: {
        videos: [
          {
            creator: "Professor Messer",
            title: "Network+ Full Course",
            url: "https://www.youtube.com/watch?v=As6g6IXcVa4",
            duration: "12:09:12",
            keyPoints: [
              "OSI Model",
              "TCP/IP Suite",
              "Common Ports and Protocols",
              "Network Topologies"
            ]
          }
        ],
        practiceExercises: [
          {
            title: "Network Scanner",
            difficulty: "Intermediate",
            description: "Create a network scanner using Python's scapy library",
            codeTemplate: `
from scapy.all import *

def network_scanner(ip_range):
    # Your code here
    pass

# Example usage
network_scanner('192.168.1.0/24')
            `,
            solution: `
from scapy.all import *

def network_scanner(ip_range):
    # Create ARP request packet
    arp = ARP(pdst=ip_range)
    ether = Ether(dst="ff:ff:ff:ff:ff:ff")
    packet = ether/arp

    result = srp(packet, timeout=3, verbose=0)[0]
    
    clients = []
    for sent, received in result:
        clients.append({'ip': received.psrc, 'mac': received.hwsrc})
    
    return clients

# Example usage
network_scanner('192.168.1.0/24')
            `
          }
        ]
      }
    }
    // Add more paths here...
  ]
};

// Local Storage Functions
const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// Review Card Component
const ReviewCard = ({ topic, onComplete }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleNext = () => {
    if (currentQuestion < topic.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowAnswer(false);
    } else {
      onComplete();
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <h3 className="font-medium mb-4">{topic.questions[currentQuestion].question}</h3>
        {showAnswer ? (
          <>
            <p className="mb-4">{topic.questions[currentQuestion].answer}</p>
            <Button onClick={handleNext}>
              {currentQuestion < topic.questions.length - 1 ? 'Next Question' : 'Complete Review'}
            </Button>
          </>
        ) : (
          <Button onClick={() => setShowAnswer(true)}>Show Answer</Button>
        )}
      </CardContent>
    </Card>
  );
};

// Main Component
const LearningTracker = () => {
  const [userProfile, setUserProfile] = useState(loadFromLocalStorage('userProfile'));
  const [currentPath, setCurrentPath] = useState(0);
  const [completedPaths, setCompletedPaths] = useState(loadFromLocalStorage('completedPaths') || []);
  const [reviewSchedule, setReviewSchedule] = useState(loadFromLocalStorage('reviewSchedule') || {});
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    saveToLocalStorage('userProfile', userProfile);
    saveToLocalStorage('completedPaths', completedPaths);
    saveToLocalStorage('reviewSchedule', reviewSchedule);
  }, [userProfile, completedPaths, reviewSchedule]);

  const handleProfileSubmit = (profile) => {
    setUserProfile(profile);
  };

  const handlePathCompletion = (pathIndex) => {
    setCompletedPaths(prev => {
      const newCompletedPaths = prev.includes(pathIndex)
        ? prev.filter(p => p !== pathIndex)
        : [...prev, pathIndex];
      
      // Schedule review for newly completed paths
      if (!prev.includes(pathIndex)) {
        setReviewSchedule(prevSchedule => ({
          ...prevSchedule,
          [pathIndex]: {
            nextReview: calculateNextReview(0),
            level: 0
          }
        }));
      }
      
      return newCompletedPaths;
    });
  };

  const handleReviewComplete = (pathIndex) => {
    setReviewSchedule(prev => ({
      ...prev,
      [pathIndex]: {
        nextReview: calculateNextReview(prev[pathIndex]?.level + 1 || 0),
        level: (prev[pathIndex]?.level + 1) || 0
      }
    }));
    setShowReview(false);
  };

  useEffect(() => {
    // Check for due reviews
    const now = new Date();
    const dueReviews = Object.entries(reviewSchedule).filter(([_, schedule]) => 
      new Date(schedule.nextReview) <= now
    );
    
    if (dueReviews.length > 0) {
      setShowReview(true);
    }
  }, []);

  if (!userProfile) {
    return <UserProfile onProfileSubmit={handleProfileSubmit} />;
  }

  const currentPathData = learningCurriculum.paths[currentPath];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <h1 className="text-2xl font-bold">Cybersecurity Learning Journey</h1>
          <p>Welcome, {userProfile.name}!</p>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span>Progress</span>
              <span>{completedPaths.length}/{learningCurriculum.paths.length} paths</span>
            </div>
            <Progress value={(completedPaths.length / learningCurriculum.paths.length) * 100} />
          </div>
        </CardContent>
      </Card>

      {showReview && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center">
              <Repeat className="h-5 w-5 mr-2" />
              Review Time!
            </h2>
          </CardHeader>
          <CardContent>
            {currentPathData.reviewTopics.map((topic, index) => (
              <ReviewCard 
                key={index} 
                topic={topic} 
                onComplete={() => handleReviewComplete(currentPath)} 
              />
            ))}
          </CardContent>
        </Card>
      )}

      <LearningPathContent path={currentPathData} />

      <div className="flex justify-between mt-6">
        <Button 
          onClick={() => setCurrentPath(prev => Math.max(0, prev - 1))}
          disabled={currentPath === 0}
        >
          Previous Path
        </Button>
        <Button 
          onClick={() => handlePathCompletion(currentPath)}
          className={completedPaths.includes(currentPath) ? 'bg-green-100 text-green-700' : ''}
        >
          {completedPaths.includes(currentPath) ? 'Path Completed' : 'Mark Path Complete'}
        </Button>
        <Button 
          onClick={() => setCurrentPath(prev => Math.min(learningCurriculum.paths.length - 1, prev + 1))}
          disabled={currentPath === learningCurriculum.paths.length - 1}
        >
          Next Path
        </Button>
      </div>
    </div>
  );
};

export default LearningTracker;
