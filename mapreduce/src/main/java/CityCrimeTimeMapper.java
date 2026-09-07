import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

public class CityCrimeTimeMapper
        extends Mapper<LongWritable, Text, Text, IntWritable> {

    private final static IntWritable one = new IntWritable(1);
    private Text outputKey = new Text();

    public void map(LongWritable key,
                    Text value,
                    Context context)
            throws IOException, InterruptedException {

        String line = value.toString();

        if (line.startsWith("Report Number"))
            return;

        String[] fields = line.split(",");

        try {

            String city = fields[4].trim();

            String timeField = fields[3].trim();

            String timePart = timeField.split(" ")[1];

            int hour = Integer.parseInt(
                    timePart.split(":")[0]);

            String timeRange = getTimeRange(hour);

            outputKey.set(
                    city + "\t" + timeRange
            );

            context.write(outputKey, one);

        } catch (Exception e) {

        }
    }

    private String getTimeRange(int hour) {

        int nextHour = (hour + 1) % 24;

        String start = convertTo12Hour(hour);
        String end = convertTo12Hour(nextHour);

        return start + " - " + end;
    }

    private String convertTo12Hour(int hour) {

        String period = (hour < 12) ? "AM" : "PM";

        int displayHour = hour % 12;

        if (displayHour == 0)
            displayHour = 12;

        return String.format(
                "%02d:00 %s",
                displayHour,
                period
        );
    }
}