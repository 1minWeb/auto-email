'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    Alert,
    AlertColor,
} from '@mui/material';
import ReactQuill from 'react-quill';

interface SMTPDetails {
    host: string;
    port: number | string;
    secure: boolean;
    user: string;
    pass: string;
}

interface EmailDetails {
    from: string;
    subject: string;
    body: string;
    clickUrl: string;
}

interface Recipient {
    email: string;
}

export default function HomePage() {
    const router = useRouter();

    const [smtpDetails, setSmtpDetails] = useState<SMTPDetails>({
        host: 'smtp.gmail.com',
        port: '465',
        secure: true,
        user: 'smtpmail98@gmail.com',
        pass: 'gzut fled esyo vjvs',
    });

    const [emailDetails, setEmailDetails] = useState<EmailDetails>({
        from: '',
        subject: '',
        body: '',
        clickUrl: 'http://localhost:3000', // Default Click URL
    });

    const [recipientsString, setRecipientsString] = useState(''); // Single input for recipients
    const [sendAsGroup, setSendAsGroup] = useState(false);
    const [scheduleEmail, setScheduleEmail] = useState(false);
    const [scheduleDate, setScheduleDate] = useState('');
    const [loading, setLoading] = useState(false);

    // Snackbar state for notifications
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleSMTPDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleSMTPDialogClose = () => {
        setDialogOpen(false);
    };

    const handleSMTPSave = () => {
        setEmailDetails({ ...emailDetails, from: smtpDetails.user }); // Automatically set the "From" email
        handleSMTPDialogClose();
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Split recipients by commas and remove any extra spaces
        const recipientsArray = recipientsString
            .split(',')
            .map((email) => email.trim())
            .filter((email) => email); // Filter out any empty strings

        const recipients = recipientsArray.map((email) => ({ email }));

        // Dynamically update the click URL before sending
        const updatedEmailDetails = {
            ...emailDetails,
            clickUrl: `${emailDetails.clickUrl}?email=${recipients.map((r) => r.email).join(',')}`,
        };

        const response = await fetch('/api/sendEmails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                smtpDetails,
                emailDetails: updatedEmailDetails,
                recipients,
                sendAsGroup,
                scheduleEmail,
                scheduleDate,
            }),
        });
        const result: any = response.json()
        setLoading(false);

        // Show success or error message in Snackbar
        if (response.ok) {
            setSnackbarMessage(result.message);
            console.log(result.message)
            setSnackbarSeverity('success');
        } else {
            setSnackbarMessage(result.message || 'Error sending emails.');
            setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const navigateToClickedLinksPage = () => {
        router.push('/clicked-links');
    };

    return (
        <div className="min-h-screen flex  justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6">
            <div className='flex-col flex w-3/4'>
                <h1 className="text-4xl font-bold mb-8">Send Custom Emails</h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white text-gray-900 p-8 rounded-lg shadow-lg w-full  grid grid-cols-2 gap-8"
                >
                    {/* Left Side: SMTP Details */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">From Details</h2>
                        <div>
                            <label className="block mb-2 text-sm font-medium">From (Email)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={emailDetails.from}
                                onClick={handleSMTPDialogOpen}
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">Click URL</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={emailDetails.clickUrl}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setEmailDetails({ ...emailDetails, clickUrl: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium">Recipient Emails</label>
                            <textarea
                                className="w-full px-4 py-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter recipient emails separated by commas"
                                value={recipientsString}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                    setRecipientsString(e.target.value)
                                }
                                required
                            />
                            <p className="text-sm text-gray-500">Separate multiple email addresses with commas (,)</p>
                        </div>
                    </div>

                    {/* Right Side: Subject, Body, and Scheduling */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Email Details</h2>

                        <div>
                            <label className="block mb-2 text-sm font-medium">Subject</label>
                            <input
                                type="text"
                                placeholder='Subject'
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={emailDetails.subject}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setEmailDetails({ ...emailDetails, subject: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">Email Body</label>
                            <textarea
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows={6}
                                placeholder='Body Content'
                                value={emailDetails.body}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                    setEmailDetails({ ...emailDetails, body: e.target.value })
                                }
                                required
                            />

                        </div>

                        <h2 className="text-xl font-semibold">Options</h2>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={sendAsGroup}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setSendAsGroup(e.target.checked)
                                    }
                                    className="mr-2"
                                />
                                Send as Group
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={scheduleEmail}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setScheduleEmail(e.target.checked)
                                    }
                                    className="mr-2"
                                />
                                Schedule Email
                            </label>
                        </div>

                        {scheduleEmail && (
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={scheduleDate}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setScheduleDate(e.target.value)
                                }
                                required
                            />
                        )}

                        <button
                            type="submit"
                            className={`w-full bg-blue-500 text-white py-2 rounded-md ${loading ? 'opacity-50' : 'hover:bg-blue-600'
                                } transition duration-300`}
                        >
                            {loading ? 'Sending...' : 'Send Emails'}
                        </button>

                        <button
                            type="button"
                            className="w-full mt-4 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition duration-300"
                            onClick={navigateToClickedLinksPage}
                        >
                            View Clicked Links
                        </button>
                    </div>
                </form>
            </div>
            {/* preview to the right */}
            <div className="bg-white p-8 m-4 rounded-lg shadow-lg w-2/4 text-black">
                <h2 className="text-2xl font-semibold mb-6">Preview Email</h2>

                {/* Email Preview Box */}
                <div className="space-y-4">
                    {/* From */}
                    <div>
                        <strong>From:</strong> <span>{emailDetails.from || 'Your Email'}</span>
                    </div>

                    {/* To */}
                    <div>
                        <strong>To:</strong> <span>{recipientsString || 'Recipient Emails'}</span>
                    </div>

                    {/* Subject */}
                    <div>
                        <strong>Subject:</strong> <span>{emailDetails.subject || 'Email Subject'}</span>
                    </div>

                    {/* Body */}
                    <div className="border-t pt-4 h-[450px] overflow-auto">
                        <p className="whitespace-pre-wrap">
                            {emailDetails.body || 'This is where your email body will appear.'}
                        </p>
                        <p className='!text-blue'>Please continue the process mentioned above from here : <a href={emailDetails.clickUrl}>Click here</a>
                        </p>
                    </div>
                </div>
            </div>
            <Dialog open={dialogOpen} onClose={handleSMTPDialogClose}>
                <DialogTitle>Enter SMTP Details</DialogTitle>
                <DialogContent>
                    <input
                        type="text"
                        placeholder="SMTP Host"
                        className="w-full px-4 py-2 border rounded-md mb-4"
                        value={smtpDetails.host}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setSmtpDetails({ ...smtpDetails, host: e.target.value })
                        }
                        required
                    />
                    <input
                        type="number"
                        placeholder="SMTP Port"
                        className="w-full px-4 py-2 border rounded-md mb-4"
                        value={smtpDetails.port}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setSmtpDetails({ ...smtpDetails, port: e.target.value })
                        }
                        required
                    />
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={smtpDetails.secure}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setSmtpDetails({ ...smtpDetails, secure: e.target.checked })
                            }
                        />
                        Secure (SSL)
                    </label>
                    <input
                        type="text"
                        placeholder="SMTP User"
                        className="w-full px-4 py-2 border rounded-md mb-4"
                        value={smtpDetails.user}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setSmtpDetails({ ...smtpDetails, user: e.target.value })
                        }
                        required
                    />
                    <input
                        type="password"
                        placeholder="SMTP Password"
                        className="w-full px-4 py-2 border rounded-md mb-4"
                        value={smtpDetails.pass}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setSmtpDetails({ ...smtpDetails, pass: e.target.value })
                        }
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <button
                        onClick={handleSMTPDialogClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSMTPSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Save
                    </button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} >{snackbarMessage}
                </Alert>

            </Snackbar>
        </div>
    );
}
