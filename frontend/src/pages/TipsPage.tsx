import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer.js';
import { TipCard } from '../components/feed/TipCard.js';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';
import { Loader } from '../components/common/Loader.js';
import { Modal } from '../components/common/Modal.js';
import { api } from '../services/api.js';
import { Tip } from '../types/index.js';
import { Plus } from 'lucide-react';

export const TipsPage: React.FC = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTip, setNewTip] = useState({
    destination_id: '',
    content: '',
    season: 'winter' as const,
    tags: [] as string[],
  });

  useEffect(() => {
    loadTips();
  }, []);

  const loadTips = async () => {
    try {
      const data = await api.getTips();
      setTips(data);
    } catch (error) {
      console.error('Error loading tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (tipId: string, voteType: 'up' | 'down') => {
    try {
      await api.voteTip(tipId, voteType);
      loadTips();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleDelete = async (tipId: string) => {
    try {
      await api.deleteTip(tipId);
      loadTips();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleCreateTip = async () => {
    try {
      await api.createTip({
        ...newTip,
        user_id: 'current-user', // Mock user ID
      });
      setNewTip({ destination_id: '', content: '', season: 'winter', tags: [] });
      setIsModalOpen(false);
      loadTips();
    } catch (error) {
      console.error('Error creating tip:', error);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold text-white">Travel Tips</h1>
          <Button
            icon={<Plus size={20} />}
            onClick={() => setIsModalOpen(true)}
          >
            Share a Tip
          </Button>
        </div>

        {loading ? (
          <Loader fullScreen />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip) => (
              <TipCard
                key={tip.id}
                tip={tip}
                onVote={handleVote}
                onDelete={handleDelete}
                canDelete={true}
              />
            ))}
          </div>
        )}

        {/* Create Tip Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Share a Travel Tip"
          footer={
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateTip}>
                Post Tip
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Destination"
              placeholder="Which place is this tip about?"
              value={newTip.destination_id}
              onChange={(e) =>
                setNewTip({ ...newTip, destination_id: e.target.value })
              }
            />

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tip Content
              </label>
              <textarea
                placeholder="Share your travel experience..."
                value={newTip.content}
                onChange={(e) =>
                  setNewTip({ ...newTip, content: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Season
              </label>
              <select
                value={newTip.season}
                onChange={(e) =>
                  setNewTip({ ...newTip, season: e.target.value as any })
                }
                className="w-full px-4 py-2 rounded-lg glass text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="summer">Summer</option>
                <option value="monsoon">Monsoon</option>
                <option value="autumn">Autumn</option>
                <option value="winter">Winter</option>
              </select>
            </div>
          </div>
        </Modal>
      </div>
    </PageContainer>
  );
};
