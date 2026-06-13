-- AddColumn: trialId to sessions
ALTER TABLE "sessions" ADD COLUMN "trial_id" TEXT;

-- CreateIndex: trialId on sessions
CREATE INDEX "sessions_trial_id_idx" ON "sessions"("trial_id");

-- CreateTable: trial_usage
CREATE TABLE "trial_usage" (
    "id" TEXT NOT NULL,
    "trial_id" TEXT NOT NULL,
    "ip_hash" TEXT NOT NULL,
    "feedback_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trial_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: unique trialId on trial_usage
CREATE UNIQUE INDEX "trial_usage_trial_id_key" ON "trial_usage"("trial_id");

-- CreateIndex: ipHash on trial_usage
CREATE INDEX "trial_usage_ip_hash_idx" ON "trial_usage"("ip_hash");

-- CreateUniqueIndex: one answer per session
CREATE UNIQUE INDEX "answers_session_id_key" ON "answers"("session_id");
