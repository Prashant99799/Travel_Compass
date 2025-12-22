import { db } from '../db/client.js';
import { tips, votes } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { Tip, VoteType } from '../types/index.js';

export class TipsService {
  /**
   * Create a new tip
   */
  static async createTip(tipData: Partial<Tip>): Promise<Tip | null> {
    try {
      const result = await db
        .insert(tips)
        .values({
          user_id: tipData.user_id!,
          destination_id: tipData.destination_id!,
          destination_name: tipData.destination_name,
          content: tipData.content!,
          image_url: tipData.image_url,
          season: tipData.season,
          tags: tipData.tags,
          upvotes: 0,
          downvotes: 0,
          featured: false,
        })
        .returning();

      return result[0] as Tip || null;
    } catch (error) {
      console.error('Error creating tip:', error);
      return null;
    }
  }

  /**
   * Get all tips with optional filters
   */
  static async getAllTips(season?: string, destinationId?: string) {
    try {
      let query = db.select().from(tips);

      if (season) {
        query = query.where(eq(tips.season, season)) as typeof query;
      }

      if (destinationId) {
        query = query.where(eq(tips.destination_id, destinationId)) as typeof query;
      }

      const result = await query.orderBy(desc(tips.created_at));
      return result;
    } catch (error) {
      console.error('Error getting tips:', error);
      return [];
    }
  }

  /**
   * Get single tip by ID
   */
  static async getTipById(id: string): Promise<Tip | null> {
    try {
      const result = await db
        .select()
        .from(tips)
        .where(eq(tips.id, id));

      return result[0] || null;
    } catch (error) {
      console.error('Error getting tip:', error);
      return null;
    }
  }

  /**
   * Update a tip
   */
  static async updateTip(
    id: string,
    updateData: Partial<Tip>
  ): Promise<Tip | null> {
    try {
      const result = await db
        .update(tips)
        .set({
          ...updateData,
          updated_at: new Date(),
        })
        .where(eq(tips.id, id))
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error('Error updating tip:', error);
      return null;
    }
  }

  /**
   * Delete a tip
   */
  static async deleteTip(id: string): Promise<boolean> {
    try {
      await db.delete(tips).where(eq(tips.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting tip:', error);
      return false;
    }
  }

  /**
   * Vote on a tip
   */
  static async voteTip(
    userId: string,
    tipId: string,
    voteType: VoteType
  ): Promise<boolean> {
    try {
      // Check if user already voted
      const existingVote = await db
        .select()
        .from(votes)
        .where(and(eq(votes.user_id, userId), eq(votes.tip_id, tipId)));

      if (existingVote.length > 0) {
        // Remove previous vote and update counts
        const previousVoteType = existingVote[0].vote_type as VoteType;
        await db
          .delete(votes)
          .where(and(eq(votes.user_id, userId), eq(votes.tip_id, tipId)));

        // Update tip counts
        const tip = await this.getTipById(tipId);
        if (tip) {
          if (previousVoteType === 'up') {
            await this.updateTip(tipId, {
              upvotes: Math.max(0, (tip.upvotes || 0) - 1),
            } as any);
          } else {
            await this.updateTip(tipId, {
              downvotes: Math.max(0, (tip.downvotes || 0) - 1),
            } as any);
          }
        }
      }

      // Create new vote
      await db.insert(votes).values({
        user_id: userId,
        tip_id: tipId,
        vote_type: voteType,
      });

      // Update tip counts
      const tip = await this.getTipById(tipId);
      if (tip) {
        if (voteType === 'up') {
          await this.updateTip(tipId, {
            upvotes: (tip.upvotes || 0) + 1,
          } as any);
        } else {
          await this.updateTip(tipId, {
            downvotes: (tip.downvotes || 0) + 1,
          } as any);
        }
      }

      return true;
    } catch (error) {
      console.error('Error voting on tip:', error);
      return false;
    }
  }

  /**
   * Get featured tips
   */
  static async getFeaturedTips() {
    try {
      const result = await db
        .select()
        .from(tips)
        .where(eq(tips.featured, true))
        .limit(10);

      return result;
    } catch (error) {
      console.error('Error getting featured tips:', error);
      return [];
    }
  }
}
