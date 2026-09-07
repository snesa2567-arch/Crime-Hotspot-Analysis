import java.io.IOException;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

public class CrimeTrendMapper
extends Mapper<LongWritable, Text, Text, IntWritable> {

    private final static IntWritable one = new IntWritable(1);
    private Text year = new Text();

    public void map(LongWritable key, Text value, Context context)
            throws IOException, InterruptedException {

        String line = value.toString();

        if(line.startsWith("Report Number"))
            return;

        String[] fields = line.split(",");

        if(fields.length > 1) {

            String dateReported = fields[1].trim();

            if(dateReported.length() >= 10) {

                String extractedYear =
        dateReported.substring(6,10);

                year.set(extractedYear);

                context.write(year, one);
            }
        }
    }
}